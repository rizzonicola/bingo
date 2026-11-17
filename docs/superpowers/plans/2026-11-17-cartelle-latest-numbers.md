# Cartelle Latest Numbers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the main board’s “Ultimi estratti” panel to Cartelle, under the board, and stop the previous-prize list from trapping touch scrolling on phones.

**Architecture:** The panel is a direct child of `.cartelle-game`, placed with a new `history` grid area under the board on desktop and between the board and previous prizes on phones. It renders from the existing `game.drawn` array; no state or storage changes. The touch fix removes the phone-only max height from `.prize-log` and allows normal scroll chaining.

**Tech Stack:** Classic browser scripts, shared `assets/styles.css`, page CSS, Node test runner for modules, headless Chrome CDP scripts in `/tmp/opencode` for UI.

**Spec:** `docs/superpowers/specs/2026-11-17-cartelle-latest-numbers-design.md` (approved)

## Global Constraints

- No build step, no runtime dependency, classic scripts, `file://` compatible.
- Main board and its behavior stay untouched.
- Copy in Italian, English, and French.
- Existing theme, reduced-motion, and accessibility behavior is preserved.
- State key stays `bingo.cards.v1`; no new persistence.
- Commit after each task.

## Review Focus

- A full game (90 draws) still shows the last 12 numbers, newest first.
- Reload mid-game restores the same 12 chips in the same order.
- Reset returns the panel to its empty copy.
- Reduced motion keeps the chips static; only opacity/transform animation is suppressed by the existing global rule.
- A touch drag that starts on previous-prize entries moves the page on a phone, with one entry and with many entries.

---

### Task 1: Latest numbers panel

**Files:**
- Modify: `cartelle.html` (game section, after `.board-panel`)
- Modify: `assets/cartelle.css` (game grid areas, phone areas)
- Modify: `assets/cartelle.js` (DOM refs, copy, render call, `updateRecent`)
- Test: `/tmp/opencode/cartelle-latest-numbers.mjs` (browser test only)
- Docs: `docs/superpowers/specs/2026-11-17-cartelle-mode-design.md`, `PRODUCT.md`, `DESIGN.md`, `README.md`

**Interfaces:**
- Consumes: `game.drawn: number[]`, `neapolitanName(number) -> string`, `render({ animateDraw })`, the shared `.history`, `.history__head`, `.history__empty`, `.history__list`, `.history__chip` styles.
- Produces: `#recent-list`, `#recent-empty`, `updateRecent(animate: boolean)`.

- [ ] **Step 1: Write the failing browser test**

Copy the CDP harness from `/tmp/opencode/cartelle-test.mjs`. Generate a deck, then assert:

```js
// Empty before the first draw
assert(await ev(`document.getElementById('recent-empty').hidden`) === false, 'history empty before draw');
assert(await ev(`document.getElementById('recent-empty').textContent`) === 'I numeri compaiono qui appena escono.', 'history empty copy');

// After three draws
await ev(`document.getElementById('draw-button').click()`);
await ev(`document.getElementById('draw-button').click()`);
await ev(`document.getElementById('draw-button').click()`);
assert(await ev(`document.querySelectorAll('#recent-list .history__chip').length`) === 3, 'history shows three chips');
assert(await ev(`document.querySelector('#recent-list .history__chip.is-latest').textContent`) ===
  (await ev(`JSON.parse(localStorage.getItem('bingo.cards.v1')).drawn.at(-1)`)).toString().padStart(2, '0'), 'newest chip first and highlighted');

// Reload with 20 draws
// (set state.drawn = [1..20], reload)
assert(await ev(`document.querySelectorAll('#recent-list .history__chip').length`) === 12, 'history keeps the last twelve');
assert(await ev(`document.querySelector('#recent-list .history__chip').textContent`) === '20', 'history newest first after reload');
assert(await ev(`document.querySelectorAll('#recent-list .history__chip')[11].textContent`) === '09', 'history oldest of the twelve last');

// Full game
// (set state.drawn = [1..90], reload)
assert(await ev(`document.querySelectorAll('#recent-list .history__chip').length`) === 12, 'full game still shows twelve');
assert(await ev(`document.querySelector('#recent-list .history__chip').textContent`) === '90', 'full game newest is 90');

// English copy
// (set prefs.lang = 'en', reload)
assert(await ev(`document.getElementById('recent-title').textContent`) === 'Latest numbers', 'history heading follows the language');

// Reduced motion
// (set Emulation.setEmulatedMedia reduced-motion, draw once)
assert(parseFloat(await ev(`getComputedStyle(document.querySelector('#recent-list .history__chip')).animationDuration`)) <= 0.01, 'reduced motion keeps the new chip static');

// Reset
// (click #reset-button, confirm dialog if present)
assert(await ev(`document.getElementById('recent-list').hidden`) === true, 'reset hides the list');
assert(await ev(`document.getElementById('recent-empty').hidden`) === false, 'reset shows the empty copy');

// Placement, desktop 1440x900
const board = await ev(`document.querySelector('.board-panel').getBoundingClientRect()`);
const recent = await ev(`document.querySelector('.cartelle-game > .history').getBoundingClientRect()`);
assert(recent.top >= board.bottom, 'history sits under the board on desktop');

// Placement, phone 390x844 (re-measure after resizing)
const phoneBoard = await ev(`document.querySelector('.board-panel').getBoundingClientRect()`);
const phoneRecent = await ev(`document.querySelector('.cartelle-game > .history').getBoundingClientRect()`);
const previous = await ev(`document.querySelector('.prizes--previous').getBoundingClientRect()`);
assert(phoneRecent.top >= phoneBoard.bottom && previous.top >= phoneRecent.bottom, 'phone order board, history, previous prizes');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node /tmp/opencode/cartelle-latest-numbers.mjs`
Expected: FAIL — `document.getElementById('recent-empty')` is null (or the history element is missing).

- [ ] **Step 3: Add the panel markup**

In `cartelle.html`, after the closing `</section>` of `.board-panel` and before `.cartelle-rail`:

```html
<section class="history" aria-labelledby="recent-title">
  <div class="history__head">
    <h2 id="recent-title" data-i18n="recent">Ultimi estratti</h2>
  </div>
  <p class="history__empty" id="recent-empty" data-i18n="recentEmpty">I numeri compaiono qui appena escono.</p>
  <ol class="history__list" id="recent-list" hidden></ol>
</section>
```

No saved footer and no reset button: the previous-prizes panel already has both.

- [ ] **Step 4: Place the panel in the grid**

In `assets/cartelle.css`, change the desktop areas and add the second row:

```css
.cartelle-game {
  grid-template-areas:
    "board rail"
    "history rail";
  grid-template-rows: minmax(0, 1fr) auto;
}
```

In the `max-width: 1000px` block, change the areas to and reset the rows:

```css
grid-template-areas:
  "stage"
  "latest"
  "board"
  "history"
  "previous";
grid-template-rows: auto;
```

The shared `.history { grid-area: history; }` rule already matches the new area name.

- [ ] **Step 5: Render the last 12 numbers**

In `assets/cartelle.js`, add DOM refs next to the prize refs:

```js
recentEmpty: document.getElementById('recent-empty'),
recentList: document.getElementById('recent-list'),
```

Add copy keys in `it`, `en`, and `fr`:

```js
recent: 'Ultimi estratti',
recentEmpty: 'I numeri compaiono qui appena escono.',
```

```js
recent: 'Latest numbers',
recentEmpty: 'Numbers appear here as they are drawn.',
```

```js
recent: 'Derniers numéros',
recentEmpty: 'Les numéros apparaissent ici au fur et à mesure.',
```

Add the renderer and call it from `render()` right after `updateBoard(animateDraw)`:

```js
function updateRecent(animate) {
  const recent = game.drawn.slice(-12).reverse();
  dom.recentEmpty.hidden = recent.length > 0;
  dom.recentList.hidden = recent.length === 0;
  dom.recentList.replaceChildren();

  recent.forEach((number, index) => {
    const chip = document.createElement('li');
    const name = neapolitanName(number);
    chip.className = `history__chip${index === 0 ? ' is-latest' : ''}${animate && index === 0 ? ' is-new' : ''}`;
    chip.textContent = String(number).padStart(2, '0');
    if (name) {
      chip.title = name;
      chip.setAttribute('aria-label', `${number}, ${name}`);
    }
    dom.recentList.appendChild(chip);
  });
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `node /tmp/opencode/cartelle-latest-numbers.mjs`
Expected: all assertions pass, no console errors.

- [ ] **Step 7: Run the existing suites**

Run: `node --test tests/cards.test.mjs tests/prizes.test.mjs tests/pdf.test.mjs`
Expected: 25 tests pass.

Run: `node /tmp/opencode/cartelle-test.mjs`
Expected: all assertions pass, no console errors.

- [ ] **Step 8: Update the docs**

- Cartelle spec: add the latest-numbers panel to the game screen and to the decided behaviors (last 12, newest first, empty copy).
- `PRODUCT.md`: mention “Ultimi estratti” in the Cartelle bullets.
- `DESIGN.md`: add the panel to the Cartelle layout description and phone order.
- `README.md`: mention the latest numbers panel.

- [ ] **Step 9: Commit**

```bash
git add cartelle.html assets/cartelle.css assets/cartelle.js docs PRODUCT.md DESIGN.md README.md
git commit -m "Add latest numbers to Cartelle"
```

---

### Task 2: Prize list must not trap page scrolling

**Files:**
- Modify: `assets/cartelle.css` (`overflow`/`overscroll-behavior` for `.prize-log`, phone media block)
- Modify: `docs/superpowers/specs/2026-11-17-cartelle-mode-design.md` (one line on phone scrolling)
- Test: `/tmp/opencode/cartelle-prize-scroll.mjs` (browser test only)

**Interfaces:**
- Consumes: `.prize-log` and the existing `#previous-list` entries; no JavaScript change.
- Produces: no new API.

- [ ] **Step 1: Write the failing touch test**

Copy the CDP touch harness from `/tmp/opencode/scroll-probe2.mjs`. At 390×844 with a deck and four previous prize entries:

```js
const before = await ev('scrollY');
await touchDrag(entryX, entryY, -300); // touch start on '#previous-list .prize-log__awards'
const after = await ev('scrollY');
assert(after - before > 100, 'touch on previous prize entries scrolls the page');
assert(await ev(`getComputedStyle(document.getElementById('previous-list')).overscrollBehaviorY`) !== 'contain', 'prize list allows scroll chaining');
```

Also assert a drag on `#latest-groups .prize-cards` still scrolls the page, and repeat the previous-prize drag with only one log entry (no overflow) to prove the page still scrolls.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node /tmp/opencode/cartelle-prize-scroll.mjs`
Expected: FAIL — page delta is 0 on the previous-prize drag.

- [ ] **Step 3: Remove the phone scroll trap**

In `assets/cartelle.css`:

- Change `.prize-log { overscroll-behavior: contain; }` to `overscroll-behavior: auto;`.
- Delete the `max-width: 640px` rule `.prizes--previous .prize-log { max-height: 340px; }`.

The list grows with its content on phones (at most five prize draws per game), so the page owns the scroll. On short desktop viewports the list can still scroll, and chaining now reaches the page.

- [ ] **Step 4: Run the touch test to verify it passes**

Run: `node /tmp/opencode/cartelle-prize-scroll.mjs`
Expected: all assertions pass, no console errors.

- [ ] **Step 5: Run the full regression**

Run: `node --test tests/cards.test.mjs tests/prizes.test.mjs tests/pdf.test.mjs`
Expected: 25 tests pass.

Run: `node /tmp/opencode/cartelle-test.mjs`
Expected: all assertions pass, including the previous-prize panel assertions and no console errors.

Run: `node /tmp/opencode/cartelle-latest-numbers.mjs` from Task 1 and `node /tmp/opencode/app-test.mjs`.
Expected: both pass; the main board stays at 87 assertions.

- [ ] **Step 6: Update the spec**

In `docs/superpowers/specs/2026-11-17-cartelle-mode-design.md`, state that on phones the previous-prize list is not an inner scroll box and a touch anywhere on a prize panel scrolls the page.

- [ ] **Step 7: Commit**

```bash
git add assets/cartelle.css docs/superpowers/specs/2026-11-17-cartelle-mode-design.md
git commit -m "Let prize list scroll the page on phones"
```
