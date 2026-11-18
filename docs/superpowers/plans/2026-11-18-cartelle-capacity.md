# Cartelle Capacity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the Cartelle cap to 5,000 cards, show generation progress, defer the PDF download to an explicit click, and paginate the card manager.

**Architecture:** `Cards.MAX_CARDS` becomes the single source of truth. `Cards.generateAsync` batches the existing card builder and yields between batches. Cartelle keeps the generated PDF as an in-memory Blob, shows a generating panel, then a ready panel whose download click starts the game. The manager renders 200 chips per page.

**Tech Stack:** Static HTML, CSS, classic JavaScript, Node `node:test`, headless Chromium for browser checks.

**Spec:** `docs/superpowers/specs/2026-11-18-cartelle-capacity-design.md`

## Global Constraints

- No build step, no runtime dependencies, classic scripts, `file://` compatible.
- UI copy in Italian, English, and French; every new key in all three.
- Keep existing themes, accessibility, Neapolitan names, and visual language.
- Cap is exactly `5000`; all limits derive from `Cards.MAX_CARDS`.
- Do not push.

## Review Focus

- Generating 5,000 cards must not freeze silently or lose the deck on reload.
- A download must only start from the explicit ready-button click.
- Reopening the manager with 5,000 cards must stay fast; only 200 chips exist.
- Range actions must target the whole deck, not the visible page.
- Switching language while the ready panel is visible must update its copy.

---

### Task 1: Cap and async generation

**Files:**
- Modify: `assets/cards.js`
- Test: `tests/cards.test.mjs`

**Interfaces:**
- Produces: `Cards.MIN_CARDS`, `Cards.MAX_CARDS` (5000), `Cards.generateAsync(count, { onProgress, batchSize = 250, random }): Promise<card[][]>`.

- [ ] Write tests: cap is 5000; counts 0 and 5001 throw; async deck equals sync deck for the same seed; progress reports `[3,7]`, `[6,7]`, `[7,7]` for 7 cards at batch size 3; a queued timer fires during generation.
- [ ] Run `node --test tests/cards.test.mjs`; expect failures for missing exports and async API.
- [ ] Export `MIN_CARDS`/`MAX_CARDS`, extract one shared card builder, add `generateAsync` yielding with `setTimeout(…, 0)` after each batch.
- [ ] Re-run; expect all card tests pass.

### Task 2: Cap consumers

**Files:**
- Modify: `assets/pdf.js`, `assets/game-state.js`
- Test: `tests/pdf.test.mjs`, `tests/game-state.test.mjs`

**Interfaces:**
- Consumes: `Cards.MIN_CARDS`, `Cards.MAX_CARDS`.

- [ ] Update PDF test to expect a 101-card deck to build and a 5,001-length array to be rejected with `/1 to 5000/`.
- [ ] Add game-state test: a 101-card unique deck loads; a 5,001-length array is rejected.
- [ ] Run both test files; expect failures.
- [ ] Derive both validations from `Cards.MIN_CARDS`/`Cards.MAX_CARDS`.
- [ ] Re-run; expect pass.

### Task 3: Generating and ready flow

**Files:**
- Modify: `cartelle.html`, `assets/cartelle.js`, `assets/cartelle.css`
- Test: `/tmp/opencode/cartelle-test.mjs` (browser suite, not committed)

- [ ] Add setup wrappers: fields, submit, progress (`role="status"`), ready block with `#start-button` and `#change-count`.
- [ ] Change the submit label to `generate`; the ready button keeps `download`.
- [ ] Add localized keys: `generate`, `generating(done,total)`, `generatingPdf`, `readyTitle(n)`, `readyNote`, `changeCount`; update `setupNote` and `countHint(max)`.
- [ ] In `cartelle.js`: `await Cards.generateAsync(count, { onProgress })`, show `Preparo il PDF…`, yield once, build the PDF, store `{ blob, filename }` in `pendingPdf`, persist the game, show ready.
- [ ] On `#start-button`: download the stored Blob, clear `pendingPdf`, `render()`, announce, focus draw.
- [ ] On `#change-count`: discard `pendingPdf`, clear the stored game, return to the form.
- [ ] Derive input min/max, `readCount`, `clampCount`, `stepCount`, and hint from `Cards`.
- [ ] Add spinner, progress, ready, and reduced-motion styles.
- [ ] Update the browser suite to click `#start-button` after generation.
- [ ] Run the browser suite; expect game view after the download click.

### Task 4: Manager pagination

**Files:**
- Modify: `cartelle.html`, `assets/cartelle.js`, `assets/cartelle.css`

**Interfaces:**
- Page size 200; `cardsPage` zero-based; resets to 0 after generation and `confirmNewCards`.

- [ ] Add pager markup with previous/next SVG buttons and a `#cards-page` status.
- [ ] Render only the current 200-card slice; disable pager ends; hide the pager for one page.
- [ ] Localize `pageRange(from,to,total)`, `pagePrev`, `pageNext`; format numbers by language.
- [ ] Verify with 5,000 cards: 25 pages, range actions still affect cards outside the page.

### Task 5: Docs and verification

**Files:**
- Modify: `README.md`, `PRODUCT.md`

- [ ] Update the cap, the generating/download flow, and the pager.
- [ ] Run `node --test tests/*.test.mjs`.
- [ ] Run all four browser suites and the `file://` smoke test.
- [ ] Inspect at 1440, 1024, 768, and 390 px; check ready and generating states in all three languages.
- [ ] Commit; do not push.
