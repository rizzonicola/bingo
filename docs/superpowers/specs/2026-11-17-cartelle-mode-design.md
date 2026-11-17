# Cartelle Mode — Design

- **Status:** approved 2026-11-17
- **Date:** 2026-11-17
- **Project:** Bingo (`/root/progetti/bingo`)
- **Companion documents:** `PRODUCT.md`, `DESIGN.md`, `README.md`

## 1. Summary

Add a second, separate mode called **Cartelle**. It is a referee display for a
game played with printed cards:

1. Choose how many cards to generate (1–100) and a print theme.
2. Download a print-ready A4 PDF directly, with three numbered cards per page.
3. Print and distribute the cards.
4. Call the numbers from the same screen. The screen shows the board, the latest
   number, and every new prize — ambo, terna, quaterna, cinquina, bingo — with
   the card numbers that reached it.
5. Cards that were not distributed can be disabled individually or by ranges
   such as `8-20, 27`, so they never appear in a prize call.

The primary board (`index.html`) stays the primary mode. The new mode is a
separate page (`cartelle.html`) with its own draw sequence and state, sharing
only the visual language, UI preferences, and the Neapolitan number names.

## 2. Intent and why

The current app is a digital board for a game where players mark numbers on
paper. It stops short of the two things that make that kind of evening work:
the cards themselves, and a trustworthy public record of who reached which
prize. Today the referee has to generate cards elsewhere and remember who won.

Cartelle mode closes that loop without turning the app into a casino product or
a player-facing game. It is an **Operate** surface: the referee is in a task,
the players are watching a shared screen, and the interface must disappear into
the job. The look stays the table tool already designed in `DESIGN.md`; the
new visual moments are typographic, not decorative.

## 3. Goals

- Generate valid, unique 90-ball cards in the browser, with no server, build
  step, or runtime dependency.
- Produce a direct PDF download (not the browser print dialog) with three
  cards per A4 page, numbered and readable.
- Let the referee choose a card theme, including a toner-safe black-and-white
  option.
- Run the card game from a public display with the latest number, the board,
  and large prize calls that can be read from a distance.
- Detect prizes only on active (distributed) cards, with per-row milestones and
  a full-card bingo.
- Let the referee disable individual cards or ranges quickly, and re-enable
  them later without replaying prizes already reached.
- Persist the whole card game across reloads.
- Reuse the existing themes, language system, Neapolitan names, dialogs,
  responsive patterns, and visual rules.
- Leave the main board's behavior untouched.

## 4. Non-goals

- No live synchronization between the main board and the card game. They are
  two separate games with separate draw sequences. The user picked this
  separation in the architecture decision.
- No player accounts, player names, remote players, or multiplayer sync.
- No on-screen card marking. Players mark their printed cards.
- No digital/QR cards in this version.
- No player assignment records. The only distribution state is
  active/non-distributed.
- No sounds, confetti, casino styling, or festive animations.
- No external PDF library or service.
- No tagged/accessible PDF. The PDF is a print artifact; the on-screen mode
  carries the accessible experience.
- No cross-tab synchronization. Last write wins, consistent with the main app.
- No re-generation of cards without an explicit confirmation that invalidates
  the printed set.

## 5. Anti-goals

The mode fails if it:

- makes the main board feel like one tab of a bigger app;
- makes the card game feel like gambling or a bingo hall;
- hides the board, the latest number, or the current prize behind a tab or a
  separate screen;
- announces a prize on a card that was not distributed;
- repeats a prize that has already been called;
- requires a network connection, a build, or a new dependency;
- produces cards that are invalid, duplicated, hard to read, or impossible to
  cut apart;
- loses the game on reload.

## 6. Constraints

- Static HTML, CSS, and classic JavaScript. No build step, no framework, no
  runtime dependency. `file://` should still work as well as it does today.
- A4 PDF, three cards per page, generated in the browser from a Blob.
- UI themes: the existing six (`system`, `light`, `dark`, `christmas`,
  `christmas-light`, `christmas-red`). Card print themes are a separate axis.
- Language: system, Italian, English, French, sharing
  `tombola.prefs.v1` with the main page.
- The Neapolitan names are shared with the main page.
- The existing state key `tombola.state.v1` remains reserved for the main
  board. The new mode uses `bingo.cards.v1`.
- The main shell is max 1480px, with the same topbar, page head, panels,
  radii, hairlines, and no shadows.
- The only new font is none. The PDF uses Helvetica, which every PDF reader
  has.

## 7. Approaches considered

### A — separate page (chosen)

`cartelle.html` is its own page with its own markup, styles, state, and draw
logic. It links back to the board in the topbar and shares the design tokens,
UI preferences, and number names.

**Trade-off:** two pages to maintain, and the two draw sequences are separate.
**Why chosen:** the main board stays exactly the tool it is today; the card
mode can use the full screen for its own hierarchy; state and failure modes
stay isolated; no mode switch inside the primary board.

### B — a second tab or sidebar inside `index.html`

One page with a mode switch; the card game shares the draw state.

**Trade-off:** one URL and shared draws, but the main stage must compete with
card controls and prize panels; the primary mode becomes a multi-mode app; a
state bug in either mode affects the other.
**Rejected:** it works against the "one gesture, one number" character and
risks the primary experience.

### C — print-first generator only

Generate the PDF and let the printed cards be scored by hand.

**Trade-off:** simpler, but it fails the live tracking requirement and leaves
the referee with the same manual work.
**Rejected:** it does not solve the problem.

## 8. The mode at a glance

```
Main board (index.html)  ── topbar link ──▶  Cartelle (cartelle.html)
                                               │
                          no cards saved ──────▶ Setup
                                               │  choose count + theme
                                               │  download PDF
                                               ▼
                                             Game
                                               │  draw numbers
                                               │  prize calls
                                               │  card manager drawer
                                               │  re-download PDF
                                               │  new cards (confirmed)
```

The topbar link is a **mode switch**, not a companion. The cartelle page is the
display for the card game. Its 90-number board replaces the main board while
the card game is being played.

## 9. Setup screen

### State

Shown when no valid card state exists. The page head becomes:

- **H1:** “Prepara le cartelle” / “Prepare the cards” / “Préparez les cartes”.
- **Intro:** “Scegli quante cartelle servono, scarica il PDF e stampalo. Poi
  chiama i numeri da questa schermata.” / “Choose how many cards you need,
  download the PDF, and print it. Then call the numbers from this screen.” /
  “Choisissez le nombre de cartes, téléchargez le PDF et imprimez-le. Ensuite,
  tirez les numéros depuis cet écran.”

No tally, progress bar, active-cards button, or stage is shown.

### Layout

One full-width surface panel under the page head. Inside:

```
┌──────────────────────────────────────────────────────────────────┐
│ Numero di cartelle          Tema delle cartelle                   │
│ [ − ] [  12  ] [ + ]        [ Classico ] [ Natale ]              │
│                             [  Crema   ] [ B/N    ]              │
│                                                                  │
│ [ Scarica il PDF ]                                               │
│ PDF A4 · 3 cartelle per pagina. Il PDF si scarica subito; poi    │
│ si gioca da qui.                                                 │
└──────────────────────────────────────────────────────────────────┘
```

- Desktop: count field about 280px, theme field takes the rest, four theme
  choices in one row. Below 1000px the fields stack; the theme choices become
  2 × 2 on phones.
- The primary button is full width, 56px, with a download icon.
- The panel is flat: `--surface`, 1px hairline, 16px radius, 24px padding.
- The setup has no heading inside the panel; the page head is the heading.

### Count field

- Label: “Numero di cartelle” / “Number of cards” / “Nombre de cartes”.
- A number input, 1–100, default **12**. Hidden native spinners; visible
  minus and plus buttons (44px) on either side.
- The input is 56px high, tabular, 24px bold. `inputmode="numeric"`.
- Minus/plus accessible names: “Una cartella in meno” / “Una in più”
  (localized).
- Clamp on blur. Invalid or empty input keeps the PDF button disabled and
  shows the hint “Da 1 a 100.” / “From 1 to 100.”.
- The count cannot be changed after generation except through “Nuove
  cartelle”, which clears the game.

### Card theme field

- Legend: “Tema delle cartelle” / “Card theme” / “Thème des cartes”.
- Hint: “Solo per il PDF.” / “For the PDF only.” / “Pour le PDF uniquement.”
  This distinguishes it from the UI color setting.
- Four choices, each a radio card with a miniature card preview and a label:
  Classico, Natale, Crema, Bianco e nero. The previews use the real print
  palette (see §14), not the UI accent.
- The selected state follows the existing `.choice` pattern: accent border,
  `--accent-soft` background, check mark. The preview itself does not change.
- The theme picker is rendered from the same palette object the PDF uses, so
  the preview and the PDF cannot drift.

### Download action

- Button: “Scarica il PDF” / “Download PDF” / “Télécharger le PDF”.
- On click:
  1. Read the count and theme.
  2. Generate the cards and validate every card and uniqueness.
  3. Build the PDF in memory.
  4. Trigger the Blob download inside the click gesture.
  5. Save the state: cards, theme, empty draw/log/seen, all cards active.
  6. Switch to the game, update the page head, focus the draw button, and
     announce “24 cartelle generate. PDF scaricato.” in the live region.
- If generation or validation throws, stay on setup, keep the current choices,
  and show an inline error under the button: “Non è stato possibile generare
  il PDF. Riprova.” The button is re-enabled. No partial state is saved.
- No loading spinner: generation is synchronous and fast. The button is
  disabled for the duration of the click handler.
- The primary action does not call `window.print()`.

## 10. Game screen

### Page head

- **H1:** “Cartelle” / “Cards” / “Cartes”.
- **Intro:** “Chiama i numeri uno alla volta. I premi valgono solo per le
  cartelle attive.” / “Call the numbers one at a time. Prizes count only for
  active cards.” / “Tirez les numéros un par un. Les prix ne comptent que
  pour les cartes actives.”
- Right group: tally “0 / 90 estratti” and a ghost button with a cards icon,
  “Cartelle · 24 attive” (localized), which opens the card manager drawer.
- Progress bar, same as the main board, spanning both columns.
- The active-cards button is the secondary action. The draw button remains the
  only primary action.

### Desktop layout (above 1000px)

```
┌ board ─────────────────────────────┐ ┌ stage ───────────────────┐
│                                    │ │ Ultima estrazione        │
│        90-number board             │ │ 37                       │
│                                    │ │ Restano 62 numeri.       │
│                                    │ │ [ Estrai un numero ]     │
│                                    │ └──────────────────────────┘
│                                    │ ┌ premi di questa estrazione
│                                    │ │ Cinquina                 │
│                                    │ │ 8 · 14                   │
│                                    │ │ Bingo                    │
│                                    │ │ 8                        │
│                                    │ └──────────────────────────┘
│                                    │ ┌ premi precedenti ────────┐
│                                    │ │ 11ª · 42                 │
│                                    │ │ Terna 3 · Quaterna 7     │
│                                    │ │ …                        │
└────────────────────────────────────┘ └──────────────────────────┘
```

- The board keeps the existing `.board-panel` and 10 × 9 layout, full height.
- The right rail is 320–380px wide and has three stacked panels: stage, latest
  prizes, previous prizes. The log panel is the flexible row and scrolls
  internally; the page itself should not scroll unless the latest prizes are
  unusually tall.
- The stage reuses the main stage markup and styles: latest number huge,
  Neapolitan name if enabled, status, draw button.

### Tablet and phone

- **≤1000px:** one column, in this order: stage, latest prizes, board, previous
  prizes. The stage uses the main's two-column tablet layout (number left,
  actions right) from 641–1000px.
- **≤640px:** stage stacks vertically; latest prizes come immediately after
  it, before the board; then the board; then the previous prizes. The reason
  is that a prize call must not fall below the board on a phone.
- The board keeps its 10:9 ratio and 3px gaps on phones.
- The topbar is handled in §20.

### Prize panel — latest draw

- Header: “Premi di questa estrazione” / “Prizes on this draw” / “Prix de ce
  tirage” and the draw ordinal (“12ª estrazione”).
- Before any draw: “I premi compaiono dopo la prima estrazione.” / “Prizes
  appear after the first draw.” / “Les prix apparaissent après le premier
  tirage.”
- After a draw with no new prizes: “Nessun premio a questa estrazione.” / “No
  prizes on this draw.” / “Aucun prix pour ce tirage.”
- With prizes: one group per tier, highest first: Bingo, Cinquina, Quaterna,
  Terna, Ambo. Each group is the localized tier name (17–20px, 700) and the
  card numbers (32–44px, 800, tabular), wrapping as needed.
- This is the **second-largest type on the page**, after the latest draw
  number. It must be legible from across a room.
- The Bingo group uses `--accent-soft` background, a 1px accent border, and
  the accent for the tier label. Other groups are flat with hairlines.
- A prize group enters with a 240ms fade/translate; `prefers-reduced-motion`
  removes it. No confetti, no looping.
- If no cards are active, a notice above the groups says “Nessuna cartella
  attiva: i premi non verranno cercati.” / “No active cards: prizes will not
  be checked.” / “Aucune carte active : les prix ne seront pas recherchés.”
  The notice uses ink, not a new warning color. The group list still shows
  past prizes.

### Prize panel — previous prizes

- Header: “Premi precedenti” / “Previous prizes” / “Prix précédents” and the
  reset text button “Ricomincia” (localized, existing copy).
- Newest first. One entry per draw that produced at least one prize:
  - meta line: draw ordinal and drawn number, e.g. “11ª · 42”;
  - award lines: “Terna 3 · Quaterna 7 · Bingo 7”.
- The latest draw's entry is excluded here when its prizes are already shown
  in the latest panel, so a prize is never listed twice.
- The list scrolls; all of the game's prize draws are kept. On phones the list
  has a max-height of about 340px. The reset button stays in the header.
- Empty: “Le estrazioni con premi compaiono qui.” / “Draws with prizes appear
  here.” / “Les tirages avec des prix apparaissent ici.” This copy is true both
  before the first prize and after the first prize, when the only entry is
  already shown in the latest panel and therefore excluded here.
- Footer: the save status “Salvato su questo dispositivo.” / “Not saved on this
  device.”, same as the main app.
- Reset opens the existing confirm pattern. After confirm, drawn numbers,
  prizes, and `seen` are cleared; cards, theme, and disabled cards stay. The
  copy is “Tutti i numeri tornano disponibili e i premi si azzerano. Le
  cartelle restano le stesse.” Focus returns to the draw button.

## 11. Card model and generator

A card is a standard 90-ball card:

- 3 rows × 9 columns, 15 numbers, 5 per row.
- Each column maps to a number range: 1–9, 10–19, 20–29, 30–39, 40–49,
  50–59, 60–69, 70–79, 80–90.
- Each column has 1–3 numbers, sorted ascending from top to bottom.
- No number repeats on a card.
- Cards are numbered 1..N and are unique within the generated set.

### Recommended generation algorithm

1. Build the nine column pools.
2. For each card, pick 5 distinct columns for each row (three random
   selections of 5 out of 9). This gives 15 cells and exactly 5 per row.
3. Count the selected cells per column. If any column has 0 or more than 3,
   retry. The rejection rate is low and the loop is bounded.
4. For each column, choose as many numbers as its cell count from that
   column's pool; sort them and place them top-to-bottom in the selected rows.
5. Validate the card (§ below). Retry invalid cards.
6. Serialize the grid and reject a card whose signature already exists. Retry
   until unique.

Use the same unbiased crypto-based random index pattern as `assets/app.js`,
falling back to `Math.random` only if the crypto API is unavailable. A bounded
retry loop with a thrown error is acceptable; in practice 100 cards are easy.

### Validation

Every generated card is checked before the PDF is built:

- exactly 15 numbers, all unique, all 1–90;
- exactly 5 numbers in each row;
- 1–3 numbers in each column;
- every number in its column's range;
- each column sorted ascending.

The card generator and validator live in a pure classic script
(`assets/cards.js`) with no DOM access, so the PDF builder and the test harness
can use them directly.

A card's stored grid is three arrays of nine entries, each a number or `null`.

## 12. Prize model

Prizes are per row, on active cards only:

| Count on one row | Prize (it / en / fr) |
| --- | --- |
| 2 | Ambo / Pair / Paire |
| 3 | Terna / Trio / Trio |
| 4 | Quaterna / Quartet / Quatuor |
| 5 | Cinquina / Line / Ligne |
| all 15 card numbers | Bingo / Bingo / Bingo |

### Rules

- A row's threshold is reached when that row has that many drawn numbers. The
  thresholds are cumulative but each is announced only once per row per game.
- A card can be at different thresholds on different rows at the same time.
- A card's full set of 15 numbers is a separate Bingo award. When the final
  number is drawn it normally also completes a row, so the same draw can
  produce a Cinquina on that card **and** the Bingo. Both are shown and
  announced.
- A draw can produce awards on many cards. All are collected and grouped by
  tier.
- Only active cards are considered. Disabled cards produce no new awards.
- When a card is re-enabled, its `seen` state is silently synced to the
  current draw counts: it may have already passed some thresholds while it was
  disabled, and those are not replayed. From then on, only new thresholds are
  announced.
- Past prize log entries are never rewritten or removed when a card is
  disabled, re-enabled, or reset (reset clears the whole log).
- The latest draw panel always describes the latest draw, even if it produced
  no prizes.
- The previous-prizes log contains only draws with awards, newest first. It
  excludes the latest draw's entry to avoid duplicating the latest panel.

### Announcement

One polite live-region message per draw:

- Base: the existing “Estratto il 37: 'O muorto che parla.” pattern, with the
  Neapolitan name when enabled, plus the remaining-count sentence.
- Then, for each tier highest-first: “Cinquina sulla cartella 8.” or
  “Cinquina sulle cartelle 8, 12 e 20.”
- English: “Pair on card 3.” / “Pair on cards 3, 7 and 12.”
- French: “Paire sur la carte 3.” / “Paire sur les cartes 3, 7 et 12.”
- No “no prizes” announcement; the visible empty state is enough.

The visual prize panel is **not** an `aria-live` region; the separate sr-only
live region carries the announcement and avoids double-speaking.

Prize detection is a pure classic script (`assets/prizes.js`) so the row
thresholds, Bingo, disabled cards, and silent re-enable sync can be tested
without a browser. Its API is defined in the implementation plan.

### Reset

- Draw order, latest prizes, previous prizes, and `seen` are cleared.
- Cards, card count, print theme, and disabled cards remain, because the same
  printed cards are normally reused for the next round.
- The state is saved immediately.

## 13. Active and disabled cards

- Newly generated cards are all active.
- “Attiva” means distributed and eligible for prizes. “Non distribuita” means
  disabled.
- The card manager is a drawer (native `<dialog>`, same pattern as settings):
  - Title “Cartelle” and a lede: “Disattiva le cartelle che non hai
    distribuito: i premi vengono cercati solo tra quelle attive.”
  - Summary: “18 attive · 6 non distribuite”.
  - A range field: label “Intervalli”, hint “Per esempio 8-20, 27”, and two
    buttons: “Disattiva” and “Riattiva”.
  - A grid of numbered toggle buttons, one per card. Active chips use
    `--accent-soft`, an accent border, and a small accent dot; disabled chips
    use a dashed border, transparent background, and muted text. The state is
    never conveyed by color alone: the dot and dashed border differ too.
  - A one-line legend explaining the two chip states.
  - Footer: “Fatto” (full width), plus utility actions “Scarica di nuovo il
    PDF” and “Nuove cartelle”.
- Range parsing:
  - accepts comma-separated numbers and inclusive ranges, e.g. `8-20, 27`;
  - also accepts the en dash;
  - ignores whitespace;
  - valid tokens are within 1..cardCount, ranges start ≤ end;
  - invalid tokens are ignored; if no valid token is found, show “Scrivi
    numeri o intervalli tra 1 e 24.” (localized, with the current count);
  - applying updates the state and persists immediately.
- The two bulk buttons apply to the parsed set. The individual chips toggle on
  click. Every change persists immediately; closing the drawer loses nothing.
- Re-enabling syncs silently (§12), so a re-enabled card does not immediately
  claim prizes it passed while disabled. The state is saved.
- “Nuove cartelle” opens a confirm: “Generare nuove cartelle?” / “La partita
  in corso e le cartelle attuali vengono eliminate. Le cartelle già stampate
  non saranno più valide.” Confirm action: “Genera nuove cartelle” in danger
  red. On confirm, clear `bingo.cards.v1`, return to setup with the defaults
  (12 cards, Classico), focus the count field.
- “Scarica di nuovo il PDF” rebuilds the current cards with the stored print
  theme. It does not change state. If it fails, show an inline error inside
  the drawer.
- The drawer trigger shows the current count, e.g. “Cartelle · 18 attive”.
  The same count is in the summary.

## 14. PDF specification

### Page and card geometry

- A4 portrait: 595.28 × 841.89 pt (210 × 297 mm).
- Three cards per page, stacked vertically, centered with 14pt gaps.
- Card frame: 523.28 × 228 pt (184.5 × 80.4 mm), 36pt side margins.
- Header band: 30pt high, full card width.
- Table: 9 columns × 3 rows, 180pt high; each cell about 58.1 × 60pt
  (20.5 × 21.2 mm).
- Footer: 18pt high.
- Outer frame 0.75pt, grid lines 0.4pt. Square corners: easier to cut and
  cheaper to print than a UI-shaped rounded card.
- Header: “Cartella 7” (localized: Card 7 / Carte 7), 15pt Helvetica-Bold,
  left-aligned with 14pt padding; “Bingo” 9pt, right-aligned.
- Numbers: Helvetica-Bold 20pt, centered in each cell.
- Footer: “Bingo / 1-90” at 7.5pt, muted, left; theme-independent.
- The table fills the card; empty cells stay blank. No drawn/marked state is
  printed.
- A page with fewer than three cards leaves the bottom bands blank; it does
  not stretch the cards.
- 1 card → 1 page; 12 cards → 4 pages; 100 cards → 34 pages.

### Themes

The PDF is always on white paper; the theme changes ink and header color, not
the UI theme. The theme palette lives in one object used by both the PDF and
the setup preview.

| Theme | Header | Header ink | Number ink | Grid lines | Cell tint | Accent rule |
| --- | --- | --- | --- | --- | --- | --- |
| Classico | `#0d766e` | `#f5fbf8` | `#1a2122` | `#c7d2cf` | `#ffffff` | `#0d766e` |
| Natale | `#0c1711` | `#e8c375` | `#1f3128` | `#cfc7b4` | `#ffffff` | `#a8823c` |
| Crema | `#f1e8d8` | `#8f1d17` | `#1f3128` | `#d8cbb8` | `#fffaf0` | `#b3261e` |
| Bianco e nero | `#1a1a1a` | `#ffffff` | `#000000` | `#b3b3b3` | `#ffffff` | `#1a1a1a` |

- Classico uses the standard table teal.
- Natale uses pine and tree gold.
- Crema uses the Christmas-light cream and holly red, with a very light cream
  cell tint.
- Bianco e nero is truly grayscale: no color operators anywhere in the page
  stream.
- Header text contrast is AA at the sizes used.
- The PDF header uses a filled band; the accent rule is a thin line under the
  header (optional if the band already carries the color).
- The grid is the dominant structure; no decorative borders or festive icons.

### Implementation

- A pure `assets/pdf.js` classic script builds the PDF with no dependency:
  page objects, content streams, Helvetica/Helvetica-Bold base-14 fonts,
  uncompressed streams, and a correct xref table.
- All PDF strings are ASCII: “Cartella”, “Card”, “Carte”, “Bingo”, “1-90”.
  This avoids font/encoding complexity. The UI remains fully localized.
- `MediaBox [0 0 595.28 841.89]`; `/Count` equals the page count.
- File name: `bingo-cartelle-24.pdf` (card count included).
- Download: `new Blob([pdf], { type: 'application/pdf' })`, object URL,
  temporary `<a download>`, click, revoke. The download starts inside the
  user's click.
- PDF metadata: title “Bingo - 24 cartelle” (localized ASCII), author/producer
  “Bingo”. No creation date, so output is deterministic for tests.
- The PDF is generated from the saved cards and stored print theme. It is the
  only print artifact; the live screen has no print action.

### Why Helvetica

The app's Gabarito is a UI face. Embedding it would require a TTF/OTF subset
and a font-writing layer; a woff2 is not usable directly. Helvetica is a
base-14 font available in every PDF reader, prints reliably, and keeps the
generator small. The PDF is a document, not a screenshot of the app.

## 15. State and persistence

### Key

`bingo.cards.v1` is new and belongs to the card mode only. The main board keeps
`tombola.state.v1`; preferences stay in `tombola.prefs.v1`.

### Shape

```json
{
  "cards": [
    [
      [3, 12, null, 34, 41, null, null, null, 88],
      [null, 17, 20, null, null, 52, 63, 71, null],
      [8, null, 27, null, 49, 58, null, 79, null]
    ]
  ],
  "printTheme": "classico",
  "drawn": [3, 12, 34, 41],
  "disabled": [],
  "seen": {
    "1": { "rows": [4, 0, 0], "bingo": false }
  },
  "log": [
    {
      "number": 41,
      "awards": [
        { "card": 1, "tier": "quaterna" }
      ]
    }
  ]
}
```

- `cards`: 1–100 valid 3 × 9 grids. Card number = index + 1.
- `printTheme`: one of `classico`, `natale`, `crema`, `biancoNero`.
- `drawn`: unique numbers 1–90 in draw order.
- `disabled`: card numbers that are not distributed; unique, in range.
- `seen[card]`: the highest row threshold processed for each of the three
  rows (0–5) and whether Bingo has been processed. Used to deduplicate awards
  and to sync silently on re-enable.
- `log`: draws with at least one award, in draw order. The draw ordinal is
  derived from `drawn.indexOf(number) + 1`; entries whose number is not in
  `drawn` are dropped on load.
- No version field; the key is versioned.

### Loading and validation

- Parse defensively; never throw.
- A deck is valid only when it has 1–100 cards, every grid passes the card
  validator, and every grid signature is unique. If `cards` is missing, empty,
  over the limit, duplicated, or contains an invalid grid, show setup. Do not
  salvage a partial deck: card numbers must stay contiguous and the printed
  set must match. Leave the stored value untouched until the user generates a
  new deck, so a corrupt save is not silently rewritten on load.
- Sanitize `drawn` like the main app: integers 1–90, unique, in order.
- Drop disabled entries outside 1..cards.length; dedupe.
- Sanitize log entries: known card numbers, known tier keys, awards for active
  or previously active cards are both allowed (a prize remains history after
  a card is disabled). Drop malformed entries.
- If `seen` is missing for a card, initialize it and silently sync to the
  current drawn counts so a reload never replays old prizes.
- If `printTheme` is unknown, use `classico`.
- If storage is unavailable, keep working in memory and switch the save copy
  to “not saved”, same pattern as the main app. Persistence failures never
  block drawing or generation.

### Persistence moments

- After generation.
- After every draw (including a prize log update).
- After every active/disabled toggle, bulk range apply, reset, and new-card
  confirmation.
- Preferences save through the existing `tombola.prefs.v1` handlers.

## 16. Localization

The page supports system, Italian, English, French, using the same detection
and persistence rules as the main app. The settings drawer is duplicated
markup with the same language/names/color controls. The names array is
extracted to a shared file so both pages use the same data.

### Key labels

| Key | it | en | fr |
| --- | --- | --- | --- |
| mode link | Cartelle | Cards | Cartes |
| back link | Tabellone | Board | Tableau |
| setup title | Prepara le cartelle | Prepare the cards | Préparez les cartes |
| count | Numero di cartelle | Number of cards | Nombre de cartes |
| card theme | Tema delle cartelle | Card theme | Thème des cartes |
| PDF only | Solo per il PDF. | For the PDF only. | Pour le PDF uniquement. |
| download | Scarica il PDF | Download PDF | Télécharger le PDF |
| game title | Cartelle | Cards | Cartes |
| active button | Cartelle · 18 attive | Cards · 18 active | Cartes · 18 actives |
| latest prizes | Premi di questa estrazione | Prizes on this draw | Prix de ce tirage |
| no prize | Nessun premio a questa estrazione. | No prizes on this draw. | Aucun prix pour ce tirage. |
| previous prizes | Premi precedenti | Previous prizes | Prix précédents |
| card drawer | Cartelle | Cards | Cartes |
| disable | Disattiva | Disable | Désactiver |
| re-enable | Riattiva | Enable | Activer |
| ranges | Intervalli | Ranges | Plages |
| range hint | Per esempio 8-20, 27 | For example 8-20, 27 | Par exemple 8-20, 27 |
| new cards | Nuove cartelle | New cards | Nouvelles cartes |
| re-download | Scarica di nuovo il PDF | Download the PDF again | Télécharger à nouveau le PDF |
| theme classic | Classico | Classic | Classique |
| theme christmas | Natale | Christmas | Noël |
| theme cream | Crema | Cream | Crème |
| theme b&w | Bianco e nero | Black and white | Noir et blanc |
| tier 2 | Ambo | Pair | Paire |
| tier 3 | Terna | Trio | Trio |
| tier 4 | Quaterna | Quartet | Quatuor |
| tier 5 | Cinquina | Line | Ligne |
| full card | Bingo | Bingo | Bingo |

The existing Italian “Cartella”/“Cartelle” stays the product term. The English
“cards” is always in the bingo context, never playing cards. The French uses
“cartes” (not the French bingo “cartons”) to stay consistent with the app's
plain-language tone; the card number label in the PDF is “Carte”.

### Titles and metadata

- Document title: “Cartelle · Bingo” / “Cards · Bingo” / “Cartes · Bingo”.
- Description: mentions generating and printing cards and following the
  prizes.
- The `<html lang>` updates with the resolved language.
- The PDF labels use the current language at download time; the stored cards
  and theme do not change.

## 17. Visual design extension

The existing `DESIGN.md` system remains the source of truth. Cartelle mode adds
one surface and a print artifact; it does not add a second font, shadow,
gradient, or color system.

### Hierarchy

1. The latest drawn number is still the largest element.
2. The latest prize card numbers are the second-largest, so the public can read
   who won.
3. The board is the context, always present.
4. The active-cards count, intro, and log are service information.

### Surfaces

- Setup panel, stage, prize panels, board panel, and drawer use the existing
  `--surface`, `--surface-2`, `--line`, `--r-lg`, and no shadows.
- The prize panel uses a 1px hairline and 16px radius; the Bingo group uses
  `--accent-soft` plus `--accent` border. No new warning/celebration color.
- The card chips in the drawer: active = `--accent-soft` + solid accent border
  + accent dot; disabled = dashed `--line-strong` + muted text + no dot.
- The card theme preview uses the print palette only inside the miniature
  card; the surrounding control uses the UI tokens.

### Type

- One family, Gabarito, as today.
- Page h1 stays in the established headline range.
- The prize tier label uses the label/body scale; the card numbers use a new
  large step, `clamp(32px, 3vw, 44px)`, weight 800, tabular.
- The PDF uses Helvetica/Helvetica-Bold, not Gabarito, because it is a print
  document (see §14).
- No uppercase letter-spaced labels.

### Motion

- The existing 480ms draw stamp and 320ms history chip remain.
- The latest prize group enters with a 240ms fade/translate of 6px.
- Re-enabling cards, changing the active count, and opening the drawer use the
  existing dialog transitions.
- `prefers-reduced-motion` removes all of it.
- No confetti, flashing, or looping celebration.

### Named rules for this mode

**La regola del premio.** The prize call is typographic: tier name plus large
card numbers. It earns the accent only when it is Bingo. No casino lights.

**La regola del tabellone.** The 90-number board is always present in the game,
never behind a tab. The latest number remains the largest thing on screen.

**La regola delle cartelle distribuite.** A card that was not handed out is not
in the game. The interface says so in the count and in the manager, and the
prize logic enforces it.

## 18. Accessibility

- The mode link and back link have text labels on desktop and `aria-label`s
  when the text is visually hidden on phones. The labels contain the visible
  word (“cartelle”, “cards”, “cartes”).
- The settings button gets an `aria-label` for the icon-only ≤380px state.
- The card manager uses a native `<dialog>` with a focus trap, Esc, backdrop
  click, and focus return to the trigger.
- The range input has a visible label, hint, and `aria-describedby`; errors are
  inline and announced.
- Card chips are real `<button type="button" aria-pressed>` controls with
  accessible names such as “Cartella 7, attiva” / “Cartella 7, non
  distribuita”. State is conveyed by text and border style, not color alone.
- The setup count has a visible label and hint; the plus/minus buttons have
  accessible names. The PDF button is disabled when the count is invalid.
- The prize panel is not a live region. One sr-only polite live region
  announces the draw and the new prizes. On load it is empty, so a reload does
  not replay old prizes.
- After generation, focus moves to the draw button; after “Nuove cartelle”,
  focus moves to the count field; after reset, focus returns to the draw
  button.
- The board cells keep the main app's `aria-label` with number, optional name,
  and drawn state.
- The Space shortcut works as in the main app and is ignored in dialogs,
  inputs, buttons, and links.
- Contrast follows the existing tokens. The Bingo group is identified by the
  word “Bingo”, not only by the accent background. The PDF header/label
  combinations meet AA at the sizes used.
- The PDF is not a tagged PDF; the on-screen game is the accessible
  equivalent. This is a documented limitation, not a hidden one.

## 19. Responsive behavior

- **1440 / 1024 desktop:** board left, stage + latest prizes + previous prizes
  right. The log scrolls; the board stays whole.
- **1000 and below:** one column, stage → latest prizes → board → previous
  prizes. Stage uses the 2-column tablet layout between 641 and 1000.
- **640 and below:** stage stacks; latest prizes before the board; board; log.
  Theme choices 2 × 2. Card drawer is a bottom sheet with a pinned header and
  “Fatto” footer, like the settings sheet.
- **320:** the topbar uses icon-only mode/settings actions; no horizontal
  scroll; the board keeps 10:9; prize card numbers remain at least 30px; the
  card chips grid fits six columns at 44px.
- The setup panel stacks count → themes → download; the download button stays
  full width.
- The page head right group wraps the tally and active-cards button rather than
  shrinking them below 44px.
- The footer hides the Space shortcut on phones, as today.

## 20. Navigation and main-page changes

### Main page (`index.html`)

The only visible change is the topbar:

```
[ bingo ]                         [ Cartelle ] [ Impostazioni ]
```

- Add a `.topbar__actions` wrapper with a mode link (`cartelle.html`) and the
  existing settings button.
- Mode link: 2 × 2 cards icon + “Cartelle”, 44px high, ghost style. It gets
  `data-i18n="cards"` and `data-i18n-aria="cardsLink"`.
- At ≤640px hide the visible mode label; the link becomes a 44 × 44 icon
  button with its aria-label. At ≤380px also hide the settings label so the
  topbar fits 320px; the settings button gets `data-i18n-aria="settings"`.
- Add the two copy keys to `assets/app.js` for the three languages.
- Move the 90 Neapolitan names into `assets/names.js` (classic script, loaded
  before `app.js`); `app.js` reads the global with an empty-array fallback.
  No behavior change.
- Nothing else on the main page changes: board, stage, history, settings,
  reset, draw logic, and state stay as they are.

### Cartelle page (`cartelle.html`)

- Same shell, brand, theme bootstrap, skip link, footer, settings drawer.
- Topbar actions: a back link to `./` labeled “Tabellone” with a board icon,
  and the settings button. At ≤640 the label hides; at ≤380 the settings label
  hides, same as the main page.
- The brand also links to `./` (home). The explicit back link is the mode
  switch.
- The settings drawer is duplicated markup with the same language, names, and
  color controls, so preferences behave identically on both pages.
- The page loads `assets/names.js`, `assets/cards.js`, `assets/prizes.js`,
  `assets/pdf.js`, and `assets/cartelle.js` as deferred classic scripts, plus
  `styles.css` and `cartelle.css`.
- A no-JS notice appears if JavaScript is unavailable.

## 21. Files and code organization

```
cartelle.html              new page: setup, game, card drawer, settings, dialogs
assets/cartelle.css        new mode-specific styles; reuses styles.css tokens
assets/cartelle.js         state, i18n, draw, rendering, dialogs
assets/cards.js            pure card generation + validation (classic global)
assets/prizes.js           pure prize detection + silent sync (classic global)
assets/pdf.js              pure A4 PDF builder + theme palette (classic global)
assets/names.js            shared Neapolitan names (classic global)
tests/cards.test.mjs       Node built-in tests for card generation/validation
tests/prizes.test.mjs      Node built-in tests for prize rules/sync
tests/pdf.test.mjs         Node built-in tests for PDF structure/themes
assets/styles.css          topbar actions/mode-link rules; settings label class
assets/app.js              nav copy keys, names global, settings aria-label
index.html                 topbar link; names.js script
PRODUCT.md                 updated scope and non-goals
DESIGN.md                  new mode rules, card/print palettes, topbar
README.md                  structure, features, storage key
site.webmanifest           description now mentions cards (start_url unchanged)
```

- `cards.js`, `prizes.js`, and `pdf.js` are DOM-free and can be called from
  the page and the test harness. They must not import anything.
- `cartelle.js` listens for `change` on preferences, applies theme/language,
  renders the setup or game, and persists.
- The mode-specific CSS must not redefine the existing tokens or affect the
  main page. Shared topbar rules are the only additions to `styles.css`.

## 22. Testing and verification

### Existing regression

- Run `/tmp/opencode/app-test.mjs`; all 87 assertions must still pass, plus new
  assertions for the mode link and topbar at 320/390.
- Verify the main board, settings, reset, names, theme, and persistence are
  unchanged.
- No console errors.

### Pure-module tests

Node's built-in test runner (no package, no dependency) covers the DOM-free
modules:

- `node --test tests/cards.test.mjs`
- `node --test tests/prizes.test.mjs`
- `node --test tests/pdf.test.mjs`

### New browser smoke test

Use the existing CDP harness, a local static server, and clean storage:

1. Load `cartelle.html`; setup is visible, game hidden, count 12, Classico
   selected.
2. Change count to 5; choose each theme; verify the picker and labels.
3. Download the PDF; capture the file; verify `%PDF-1.4`, `%%EOF`, page count
   `/Count 2`, and card labels “Cartella 1”..“Cartella 5” in the stream (set
   the test preference to Italian for this label assertion).
4. Read `bingo.cards.v1`; validate all cards: 15 numbers, 5/row, 1–3/column,
   column ranges, sorted, unique cards.
5. After generation: game visible, setup hidden, 90 board cells, draw enabled,
   5 active, focus on draw.
6. Draw several numbers; after each, recompute the expected new awards from the
   cards and the previous/next drawn lists; compare with the latest panel and
   log. Verify no duplicate awards.
7. Disable `2-4, 7`; verify summary, chips, and persistence. Draw more; verify
   disabled cards never appear in new awards.
8. Re-enable a card; verify no immediate prize replay, and future awards only
   for thresholds reached after re-enabling.
9. Reset: drawn, prizes, and seen clear; cards and disabled state remain.
10. Reload: same cards, drawn, log, disabled state, language, theme.
11. New cards confirm: state clears, setup returns, focus on count.
12. Settings: language changes the page and prize labels; UI theme changes
    colors; names toggle affects the stage and board.
13. PDF re-download from the drawer uses the stored cards and theme.
14. 0 active cards shows the notice; 90 drawn disables the draw button.
15. Every control has an accessible name; dialogs trap focus, Esc closes, and
    focus returns.
16. At 320, 390, 768, 1024, 1440: no horizontal scroll, no overlap, board
    whole, latest prize above the board on phones, 44px targets.
17. Light, dark, Natale, Crema, Rosso: no contrast or token regressions.

### Bingo edge case

Seed `bingo.cards.v1` with one valid card and the other 89 numbers drawn (the
missing number belongs to the card), plus one disabled card. On load, the
silent sync leaves the latest panel empty. Draw the last number: expect a
Cinquina on that card and a Bingo on that card, one log entry, and no award
for the disabled card. This tests sync, the row milestone, and bingo without
relying on random draws.

### PDF visual check

- There is no `pdftoppm`/`pdfinfo` in this environment. Verify the bytes and
  text streams automatically; open the downloaded PDF in Chromium's viewer or
  a local print preview for a visual check of margins, theme colors, and card
  cutting.
- The PDF must look correct on white A4; the UI theme must not affect it.

### Performance

- Generating 100 cards and a 34-page PDF should stay under a few hundred
  milliseconds in headless Chrome. No network, no workers.
- The page stays dependency-free; no `package.json`, no build output.

## 23. Documentation updates

- **PRODUCT.md:** add the card mode to the purpose and capabilities; remove
  “generazione di cartelle” and the win-verdict exclusion from the non-goals;
  keep sounds, multiplayer, accounts, and digital cards out. Update the
  positioning: no registration, no casino setting, but printable cards and
  prize tracking are now part of the product. Add the separate-state decision.
- **DESIGN.md:** add a “Cartelle” section with the setup/game hierarchy, the
  second-largest prize type, the active/disabled chip treatment, the topbar
  mode link, and the four print palettes. Reiterate that the main board is
  untouched and that the PDF has its own print language.
- **README.md:** add the new page, files, `bingo.cards.v1`, the PDF flow, and
  the four card themes. Remove the “no cards to generate” line.
- **site.webmanifest:** update the description to mention cards; keep
  `start_url`, icons, colors, and scope unchanged.

## 24. Risks and known limits

- **Separate state.** The main board and the card game do not share draws. The
  card game must be played from `cartelle.html`. This is the chosen
  architecture and is stated in the UI flow.
- **PDF accessibility.** The PDF is not tagged; it is a print artifact. The
  on-screen game is the accessible equivalent.
- **iOS downloads.** Some iOS browsers open a Blob PDF in a viewer instead of
  saving it. The PDF is still produced; the user can share/save from the
  viewer. No dependency is added to change this.
- **Print color.** Colored themes depend on the printer; the black-and-white
  theme is the safe option. The Crema cell tint is deliberately light.
- **No PDF visual tool in this environment.** Byte/text tests and a manual
  print preview are the verification path.
- **Max 100 cards.** Enough for a home evening; larger events would need a
  bigger limit and a different pagination strategy.
- **No cross-tab sync.** Two open cartelle tabs can overwrite each other, as
  with the main board today.
- **No player assignment.** Active/disabled is the only distribution record.
- **Card regeneration invalidates printed cards.** The confirmation says so.
- **The PDF uses Helvetica, not Gabarito.** Intentional, for portability and a
  small, dependency-free generator.

## 25. Decisions and what is left to the builder

### Decisions made here (the user can correct these)

- 1–100 cards, default 12, 3 per A4 page.
- Four card themes: Classico, Natale, Crema, Bianco e nero.
- Setup → download → automatic switch to the game.
- All cards active by default; the referee disables the ones not distributed.
- Per-row thresholds 2/3/4/5 plus full-card Bingo; only new thresholds
  announced.
- Re-enabling syncs silently; reset keeps the deck; new cards clears it and
  returns to the defaults (12 cards, Classico).
- A saved deck is accepted only if it has 1–100 valid, unique cards; an invalid
  deck shows setup without overwriting the stored value.
- A latest-draw prize panel plus a scrollable previous-prizes log.
- Direct PDF download with a small custom PDF writer; no browser print dialog.
- The card drawer owns re-download and “Nuove cartelle”.
- The topbar gets the mode link; the main board is otherwise untouched.

### Left to the builder

- The exact internal structure of the PDF writer, object order, and stream
  helpers.
- The exact card-generation retry loop, as long as every card passes the
  validation rules and uniqueness.
- CSS class names and small spacing choices within the described system.
- The remaining microcopy not listed in §16, written in the existing tone and
  in all three languages.
- Icons for the mode link, back link, cards button, download, and plus/minus.
- The test harness details and the screenshot set.
- The exact 100-card chip layout and the range-parser edge-case handling.
- The final wording of the document metadata.

### Must not change

- The main board's draw logic, state key, layout, or behavior.
- The no-build, no-dependency constraint.
- The six UI themes and Neapolitan names.
- The direct-download requirement.
- The separate draw sequences.
- The visual rules in `DESIGN.md`: flat surfaces, hairlines, no shadows, one
  accent used for state, no casino decoration.
