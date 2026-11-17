# Cartelle Mode — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-11-17-cartelle-mode-design.md` (approved)
**Goal:** add a separate `cartelle.html` mode that generates printable cards,
downloads an A4 PDF, and tracks prizes on active cards, without changing the
main board's behavior.

## Fixed decisions

- Separate page, separate state key `bingo.cards.v1`, separate draw sequence.
- 1–100 cards, default 12; three cards per A4 page.
- Print themes: Classico, Natale, Crema, Bianco e nero.
- Per-row thresholds 2/3/4/5 plus full-card Bingo; each tier is awarded only
  on its first draw, including every card that reaches it on that draw.
- Re-enabling a card syncs silently to the current draws.
- Previous-prizes empty copy: “Le estrazioni con premi compaiono qui.” / “Draws
  with prizes appear here.” / “Les tirages avec des prix apparaissent ici.”
- After “Nuove cartelle”, setup shows defaults 12 / Classico.
- A saved deck is valid only with 1–100 valid, unique cards. A bad deck shows
  setup and is left untouched in storage until the user generates new cards.
- No build step, no dependency, classic scripts, `file://` compatibility.

## Conventions

- Browser globals, one per module:
  - `globalThis.BINGO_NAMES` — array of 90 strings.
  - `globalThis.BingoCards` — card generation/validation/ranges.
  - `globalThis.BingoPrizes` — prize detection/sync.
  - `globalThis.BingoPdf` — print palettes/PDF builder.
- DOM-free modules end with:
  ```js
  if (typeof module === 'object' && module.exports) module.exports = api;
  ```
  so Node tests can load them as classic scripts.
- Node tests are `.mjs` files that `import '../assets/<module>.js'` for the
  side effect, then read `globalThis.Bingo*`. No `package.json`.
- Commit after each task. Keep `index.html` behavior unchanged except the
  topbar link.

## File map

```
cartelle.html                 new page
assets/cartelle.css           new mode styles
assets/cartelle.js            page controller
assets/cards.js               pure card logic
assets/prizes.js              pure prize logic
assets/pdf.js                 pure PDF writer + print palettes
assets/names.js               shared Neapolitan names
tests/cards.test.mjs
tests/prizes.test.mjs
tests/pdf.test.mjs
assets/styles.css             shared topbar additions
assets/app.js                 mode-link copy, shared names, settings aria
index.html                    names.js + topbar mode link
PRODUCT.md / DESIGN.md / README.md / site.webmanifest
```

---

## Task 1 — Shared names and the main-page mode link

**Files:** `assets/names.js` (new), `assets/app.js`, `index.html`,
`assets/styles.css`.

1. Create `assets/names.js` with `globalThis.BINGO_NAMES = [...]` containing the
   90 names currently in `assets/app.js`, unchanged and in order.
2. In `assets/app.js`, delete the inline array and add:
   ```js
   const NEAPOLITAN_NAMES = globalThis.BINGO_NAMES || [];
   ```
3. In `index.html`, load `<script src="assets/names.js" defer></script>` before
   `app.js`.
4. Wrap the topbar right side:
   ```html
   <div class="topbar__actions">
     <a class="mode-link" href="cartelle.html" data-i18n="cards" data-i18n-aria="cardsLink">Cartelle</a>
     <button class="settings-button" ... data-i18n-aria="settings">...</button>
   </div>
   ```
   The mode link gets a 2 × 2 cards SVG (`aria-hidden`).
5. Add copy keys in all three languages: `cards` (Cartelle / Cards / Cartes)
   and `cardsLink` (Apri le cartelle / Open the cards / Ouvrir les cartes).
6. In `assets/styles.css`:
   - `.topbar__actions { display:flex; gap:8px; align-items:center; }`
   - share the `.settings-button` visual rules with `.mode-link`.
   - ≤640px: hide `.mode-link span` and make it a 44 × 44 icon button.
   - ≤380px: hide `.settings-button span`, make it 44 × 44, centered.
7. Run `/tmp/opencode/app-test.mjs`; all 87 assertions pass. Check 320/390
   topbar: no overflow, both actions 44px, settings has an aria-label.
8. Commit: `Add Cartelle mode link to the board`.

## Task 2 — Card generator, validator, range parser

**Files:** `assets/cards.js` (new), `tests/cards.test.mjs` (new).

### API

```js
BingoCards = {
  MIN_CARDS: 1,
  MAX_CARDS: 100,
  generate(count, random = randomIndex), // grid[]; throws RangeError outside 1..100
  validateCard(grid),                    // boolean
  gridSignature(grid),                    // string
  parseRanges(text, max),                // sorted unique number[]
}
```

- A grid is `[row0, row1, row2]`, each an array of 9 entries (`number|null`).
- Column pools: 1–9, 10–19, …, 80–90.
- Generation: choose five columns per row (`random`); retry if any column is
  outside 1..3; fill each column from its pool; validate; reject duplicate
  signatures. Bound each per-card attempt (e.g. 200) and throw on exhaustion.
- `random(max)` returns an integer `0..max-1`; use the existing unbiased
  crypto pattern, fall back to `Math.random`.
- `parseRanges` accepts comma-separated numbers and inclusive `-`/`–` ranges,
  ignores whitespace and invalid/out-of-range tokens, returns sorted unique
  numbers. If nothing valid, returns `[]`.

### Tests (`node --test tests/cards.test.mjs`)

- Generate 100 cards; every card passes `validateCard`.
- Every row has 5 numbers; every column 1–3; column ranges correct; column
  order ascending; all 15 numbers unique.
- All 100 signatures unique.
- `generate(0)`, `generate(101)`, non-integer throws.
- Seeded PRNG gives deterministic output for the same seed.
- `parseRanges('8-10, 27', 30)` → `[8,9,10,27]`; en dash works; whitespace
  works; `'10-8'`, `'0'`, `'31'`, `'x'` are ignored; `'x'` → `[]`.
- Commit: `Add card generator and range parser`.

## Task 3 — Prize engine

**Files:** `assets/prizes.js` (new), `tests/prizes.test.mjs` (new).

### API

```js
BingoPrizes = {
  TIERS: ['ambo', 'terna', 'quaterna', 'cinquina'],
  TIER_ORDER: ['bingo', 'cinquina', 'quaterna', 'terna', 'ambo'],
  emptySeen(count),                                  // object keyed "1".."count"
  syncSeen(seen, cardNumber, grid, drawnSet),        // new seen object
  detect({ cards, drawnSet, disabled, seen, claimed }),
  // claimed: tiers already closed (derived from the log)
  // -> { seen, awards: [{ card, tier }] }
}
```

- `seen` entry: `{ rows: [0..5, 0..5, 0..5], bingo: boolean }`.
- `emptySeen(n)` returns zeroed entries for every card.
- `syncSeen` sets each row to the max of its stored value and the current count,
  and sets `bingo` if all 15 numbers are drawn.
- `detect` ignores disabled cards, awards the highest newly reached row
  threshold per row, and Bingo once when all 15 are drawn. Tiers listed in
  `claimed` update `seen` silently. It updates `seen` only for active cards.
- Return awards highest-first (`bingo`, `cinquina`, `quaterna`, `terna`,
  `ambo`) and card number ascending inside a tier.
- Inputs are not mutated; return a fresh `seen` object.

### Tests (`node --test tests/prizes.test.mjs`)

Use the canonical card from the spec:
```js
[
  [3, 12, null, 34, 41, null, null, null, 88],
  [null, 17, 20, null, null, 52, 63, 71, null],
  [8, null, 27, null, 49, 58, null, 79, null],
]
```
- 2/3/4/5 numbers on row 0 produce ambo/terna/quaterna/cinquina, once each.
- Adding the last number produces both the row's cinquina and Bingo.
- Running `detect` again with the same draws returns no awards.
- A tier in `claimed` is silent but still updates `seen`; an unclaimed tier
  reached on the same draw is awarded, even when several cards share it.
- Disabled card produces no awards.
- `syncSeen` with four row-0 numbers suppresses ambo/terna/quaterna; the next
  draw produces only cinquina.
- Two cards at the same tier return both, card numbers ascending.
- `emptySeen` shape.
- Commit: `Add prize engine with silent card sync`.

## Task 4 — PDF writer and print palettes

**Files:** `assets/pdf.js` (new), `tests/pdf.test.mjs` (new).

### API

```js
BingoPdf = {
  THEMES: {
    classico:   { labelKey: 'themeClassico',   header: [13,118,110],  headerInk: [245,251,248], numberInk: [26,33,34],  grid: [199,210,207], cell: [255,255,255], accent: [13,118,110] },
    natale:     { labelKey: 'themeNatale',     header: [12,23,17],    headerInk: [232,195,117], numberInk: [31,49,40],  grid: [207,199,180], cell: [255,255,255], accent: [168,130,60] },
    crema:      { labelKey: 'themeCrema',      header: [241,232,216], headerInk: [143,29,23],  numberInk: [31,49,40],  grid: [216,203,184], cell: [255,250,240], accent: [179,38,30] },
    biancoNero: { labelKey: 'themeBiancoNero', header: [26,26,26],    headerInk: [255,255,255], numberInk: [0,0,0],     grid: [179,179,179], cell: [255,255,255], accent: [26,26,26] },
  },
  THEME_IDS: ['classico', 'natale', 'crema', 'biancoNero'],
  buildPdf({ cards, theme, lang }),  // ASCII string; throws on invalid/duplicate cards
  pdfTitle(count, lang),            // ASCII metadata title
  pdfFilename(count),               // 'bingo-cartelle-24.pdf'
}
```

- A4 portrait `595.28 × 841.89`, 3 cards per page, 14pt gaps, 36pt side
  margins, card `523.28 × 228`: header 30, table 180 (9 × 3 cells), footer 18.
- Helvetica/Helvetica-Bold base-14; uncompressed streams; correct xref table;
  `/Info` title/author/producer; no dates.
- Labels: `Cartella` / `Card` / `Carte`; right header `Bingo`; footer
  `Bingo / 1-90`.
- Fill the header band, optionally a 2pt accent rule under it, tint the table
  cell background, then draw 0.75pt outer frame, 0.4pt grid, 20pt bold centered
  numbers.
- All strings ASCII. For `biancoNero`, emit only `g`/`G` grayscale operators.
- Validate every card and reject duplicate signatures before writing.

### Tests (`node --test tests/pdf.test.mjs`)

- 5 cards → `/Count 2`, starts `%PDF-1.4`, ends `%%EOF\n`.
- `MediaBox` correct; all five `(Cartella N) Tj` labels present.
- xref: parse every `N 0 obj` offset and `startxref`; each offset starts at
  `N 0 obj`.
- Classic page stream contains the expected header RGB op; Crema contains its
  tint; B&W has no `rg`/`RG` operators and no non-equal RGB triples.
- Same input twice → identical output.
- Invalid card and duplicate deck throw; unknown theme falls back to classico.
- Commit: `Add dependency-free A4 PDF writer`.

## Task 5 — Cartelle page shell, preferences, settings, setup

**Files:** `cartelle.html` (new), `assets/cartelle.css` (new),
`assets/cartelle.js` (new).

### Markup

- Copy the head bootstrap from `index.html` (theme color meta).
- Load `names.js`, `cards.js`, `prizes.js`, `pdf.js`, `cartelle.js` with
  `defer`, plus `styles.css` then `cartelle.css`.
- Same brand, topbar with a back link (`.mode-link`, `href="./"`, board icon,
  label `Tabellone` / `Board` / `Tableau`), settings button.
- Page head: `#page-title`, `#page-intro`, `#page-tools` (tally, cards button),
  `#progress`.
- `#setup-view`:
  - `#setup-form`, count label, `#count-minus`, `#card-count` (`type=number`,
    min 1, max 100, default 12), `#count-plus`, `#count-hint`.
  - `#theme-choices` fieldset rendered by JS from `BingoPdf.THEMES`.
  - `#download-button` (primary, download icon), note copy, `#setup-error`.
- `#game-view`:
  - board panel with `#board`.
  - rail: stage (same IDs as main board), latest-prize panel
    (`#latest-groups`, `#latest-empty`, `#no-active-notice`), previous-prize
    panel (`#previous-list`, `#previous-empty`, `#reset-button`, saved label).
- `#cards-dialog`: drawer with lede, `#cards-summary`, range field, Disattiva /
  Riattiva, `#cards-grid`, legend, `#redownload-button`, `#new-cards-button`,
  `#cards-error`, Fatto.
- `#settings-dialog`: duplicate the main settings drawer (language, names,
  color).
- `#reset-dialog` and `#new-cards-dialog` confirm dialogs.
- `#live-region` polite sr-only. No-JS notice.

### `cartelle.js` (initial scope)

- Copy the theme/language/prefs logic from `app.js`; same keys, same six
  themes, same detection, same save messages.
- Build the 90-cell board once.
- Render theme choices from `BingoPdf.THEMES`; set CSS custom properties
  `--print-header`, `--print-header-ink`, `--print-ink`, `--print-grid`,
  `--print-cell`, `--print-accent` on each preview.
- Setup interactions: +/- clamp 1..100; empty/invalid disables download and
  shows “Da 1 a 100.”; blur clamps; theme radio selection persists in memory.
- Apply `data-i18n` / `data-i18n-aria`; update page title, meta, `<html lang>`;
  rerender dynamic text on language/names changes.
- Settings drawer open/close, focus return, Esc/backdrop, modal lock.
- For now, `#download-button` is wired but generation/state is Task 6.

### CSS

- Use the existing tokens, radii, hairlines, no shadows. No new colors.
- Setup panel: `--surface`, 1px line, 16px radius, 24px padding; count field
  ≈280px; four theme cards in one row; 2 × 2 at ≤640; 56px full-width primary
  button.
- Theme previews: miniature card with header band and 9 × 3 grid using the
  print palette CSS vars; surrounding control uses UI tokens.
- Game desktop grid: board left, rail 320–380px right; stage, latest prizes,
  previous prizes stacked; previous list scrolls.
- ≤1000px: `display:contents` on the rail and grid areas
  `stage → latest → board → previous`.
- ≤640: stage stacks; latest prizes stay above the board; cards drawer becomes
  a bottom sheet with sticky head/foot.
- Prize panel: tier 17–20px/700; card numbers `clamp(32px, 3vw, 44px)`/800
  tabular; Bingo group uses `--accent-soft`, accent border, accent label.
- Chips: active accent-soft + solid accent border + dot; disabled dashed
  `--line-strong`, muted, no dot.
- Cards grid: `repeat(auto-fill, minmax(44px, 1fr))`; six columns at 320.
- Prize group entrance: 240ms fade/translate; reduced motion removes it.

### Browser check

- Load `cartelle.html`: setup visible, game hidden, count 12, Classico
  selected, all text localized, no console errors.
- +/- works, invalid input disables the button, theme radios select and preview
  palettes match `BingoPdf.THEMES`.
- Settings language/theme/names change the page; prefs survive reload.
- 320/390/768/1024/1440: no horizontal scroll, 44px targets.
- Commit: `Add Cartelle setup screen and settings`.

## Task 6 — Generation, game screen, draws, prizes, persistence

**Files:** `assets/cartelle.js`, `assets/cartelle.css`.

1. Read count/theme; `BingoCards.generate`; validate all and uniqueness; build
   PDF with `BingoPdf.buildPdf`; create Blob and click a temporary anchor
   synchronously in the click handler; save state; switch to game; focus draw;
   announce the generated/downloaded message.
2. On failure: stay on setup, re-enable the button, show `#setup-error`; no
   partial state saved.
3. State:
   ```js
   { cards, printTheme, drawn, disabled, seen, log }
   ```
   Persist under `bingo.cards.v1` after generation, every draw, reset, toggle,
   and new cards. Handle storage failure by switching to the “not saved”
   message and continuing in memory.
4. Load:
   - Deck valid only if 1–100 valid unique cards; otherwise setup and do not
     rewrite the key.
   - Sanitize `drawn` (unique integers 1–90 in order), `disabled` (dedupe, in
     range), `log` (number in `drawn`, known card/tier, drop malformed),
     `seen` (rows 0–5, bingo bool).
   - Silently sync every card's `seen` up to the current row counts/Bingo so a
     reload never replays prizes.
   - Unknown `printTheme` → classico.
5. Game rendering:
   - page title/intro, tally, progress, `Cartelle · N attive` button.
   - latest number/name/status/ordinal, draw button disabled at 90.
   - board cells with `is-drawn`, `is-last`, `is-new`, names in `title` and
     `aria-label`.
   - latest panel: intro before any draw, “Nessun premio…” after a prize-less
     draw, grouped awards (Bingo first) from the latest log entry; no-active
     notice when `disabled.length === cards.length`.
   - previous panel: all log entries except the entry for the latest draw,
     newest first; empty copy from the plan; saved status.
6. Draw:
   - pick a remaining number with the unbiased random helper, derive the
     claimed tiers from `log`, append, call `BingoPrizes.detect`, store new
     `seen`, append a log entry only when there are awards, persist, render,
     announce base + tier sentences.
   - announcements: base draw copy plus, per tier highest-first, singular and
     plural forms with card numbers joined by “e” / “and” / “et”.
7. Reset: confirm; clear `drawn`, `log`, `seen` to `emptySeen`; keep cards,
   theme, and `disabled`; persist; render; announce; focus draw.
8. Space shortcut with the same guards as the main board.
9. Browser check: generate 5 cards; verify download bytes, state, board, draw,
   prizes, reload persistence, reset, 90-draw disabled state. Commit:
   `Add Cartelle game and live prize tracking`.

## Task 7 — Card manager: toggles, ranges, re-download, new cards

**Files:** `assets/cartelle.js`, `assets/cartelle.css`.

1. Open/close `#cards-dialog`; render summary “18 attive · 6 non distribuite”
   and 1..N chips with `aria-pressed` and accessible names
   “Cartella 7, attiva” / “Cartella 7, non distribuita”.
2. Individual toggle: update `disabled`; on re-enable call
   `BingoPrizes.syncSeen` for that card; persist; render game and drawer; no
   announcements and no new awards.
3. Range apply: `BingoCards.parseRanges(input.value, cards.length)`. If empty,
   show the localized error with the current count; otherwise disable/enable
   the parsed set, sync re-enabled cards, persist, rerender. Clear the input and
   error after success.
4. “Scarica di nuovo il PDF”: rebuild from saved cards/theme, direct download;
   inline error inside the drawer on failure; never change state.
5. “Nuove cartelle”: confirm dialog. On confirm, remove the storage key, close
   the drawer, show setup with defaults 12/Classico, focus the count. Cancel
   returns focus to the trigger.
6. Browser check: disable `2-4, 7`, verify summary/chips/persistence; draw and
   confirm disabled cards never win; re-enable and confirm no replay; new
   cards resets. Commit: `Add card management drawer`.

## Task 8 — Full browser smoke, accessibility, responsive pass

**Files:** `/tmp/opencode/cartelle-test.mjs` (test only), fixes in
`cartelle.html`, `assets/cartelle.*`, `assets/styles.css`.

Cover the spec's §22 list, plus:

- Existing main test still 87/87; new topbar assertions.
- PDF download captured and inspected: `%PDF-1.4`, `%%EOF`, `/Count`,
  labels, xref, theme colors, B&W grayscale.
- Deterministic Bingo edge case: seed one card, 89 drawn, a disabled card;
  draw the last number → Cinquina + Bingo, one log entry, no disabled award.
- 0 active cards notice; 90 drawn button disabled.
- Reload restores cards/draw/log/disabled/language/theme.
- Dialog focus trap, Esc, backdrop, focus return.
- 320/390/768/1024/1440 no overflow; latest prize above the board on phones;
  board whole; 44px targets.
- Light/dark/Natale/Crema/Rosso no token regressions; `prefers-reduced-motion`.
- Screenshots: setup, game with prizes, drawer, 320, mobile, themes.
- Commit: `Polish Cartelle responsive and accessibility`.

## Task 9 — Documentation

**Files:** `PRODUCT.md`, `DESIGN.md`, `README.md`, `site.webmanifest`.

- PRODUCT: add printable cards and prize tracking; remove the old “no card
  generation / no win verdict” non-goals; keep sounds, accounts, multiplayer,
  digital cards out; state that the card game has separate state.
- DESIGN: add Cartelle hierarchy, prize type sizes, Bingo treatment, chip
  states, topbar mode link, four print palettes, and “main board untouched”.
- README: new page/files, `bingo.cards.v1`, PDF flow, four print themes,
  `node --test` commands.
- Manifest: mention generated cards in the description; keep `start_url`,
  icons, colors, scope.
- Commit: `Document Cartelle mode`.

## Task 10 — Final verification

1. `node --test tests/cards.test.mjs tests/prizes.test.mjs tests/pdf.test.mjs`
   all pass.
2. `/tmp/opencode/app-test.mjs` 87+ assertions pass.
3. `/tmp/opencode/cartelle-test.mjs` passes with no console errors.
4. Manual PDF print preview once: A4, 3 cards/page, cut lines, themes.
5. `git status` clean, review diff for accidental main-board changes.
6. Commit any final fixes and push.

## Definition of done

- `index.html` behaves exactly as before, plus the topbar mode link.
- `cartelle.html` completes setup → PDF download → game → prizes → reload.
- Disabled cards never win; re-enabled cards never replay past prizes.
- No build step, no dependency, no console errors.
- All three languages and all six UI themes work on both pages.
- Tests and docs are committed.
