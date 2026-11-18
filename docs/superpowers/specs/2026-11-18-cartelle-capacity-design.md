# Cartelle Capacity and Generation Feedback — Design

- **Status:** approved 2026-11-18
- **Date:** 2026-11-18
- **Project:** Bingo (`/root/progetti/bingo`)
- **Companion documents:** `PRODUCT.md`, `DESIGN.md`, `README.md`, `2026-11-17-cartelle-mode-design.md`

## 1. Summary

Raise the Cartelle deck cap from 100 to **5,000** and make the wait visible:

1. The referee submits the setup form.
2. The panel becomes a generating state with a spinner and a live count
   (`Genero 750 di 5.000 cartelle…`), followed by `Preparo il PDF…`.
3. When the deck and PDF are ready, the same panel shows `5.000 cartelle
   pronte.` with a **Scarica il PDF** button.
4. Clicking that button downloads the PDF, starts the card game, and focuses
   the draw button.

The card manager renders **200 chips per page**, with previous/next controls
and a localized `1–200 di 5.000` status. Ranges stay unchanged and apply to
the whole deck, not just the visible page.

## 2. Why 5,000

Measured on the current generator:

| Cards | Generate | PDF | Saved deck |
| --- | --- | --- | --- |
| 100 | ~60 ms | 0.18 MB, 34 pages | 11 KB |
| 5,000 | ~3.2 s | ~9 MB, 1,667 pages | ~550 KB |
| 10,000 | ~7.5 s | 18.5 MB, 3,334 pages | 1.06 MB |

5,000 keeps generation short enough for a single visible spinner, keeps the
PDF printable, and leaves room in the browser's ~5 MB `localStorage` quota for
the saved game and prize log. 10,000 adds no practical print benefit for a
home evening and risks losing the save.

## 3. Decisions

- `Cards.MAX_CARDS` is the single source of truth. The generator, PDF
  validation, saved-game restore, input min/max, clamping, stepping, and the
  hint all read it.
- Generation stays on the main thread in batches of 250 cards, yielding to the
  browser between batches. No Web Worker: workers are blocked on `file://` in
  Chrome, and the app must keep working there.
- The synchronous `Cards.generate` stays for tests and PDF callers; a new
  `Cards.generateAsync` shares the same card builder and uniqueness set, so
  both paths produce identical decks from the same random source.
- The PDF is built after generation, then held in memory as a Blob until the
  explicit download click. Downloads started after async work are unreliable
  in Safari, so the click must be a direct user gesture.
- The game is persisted as soon as generation finishes. A reload before the
  download shows the game; the PDF can still be rebuilt from the saved deck
  with "Scarica di nuovo il PDF".
- The generating state replaces the setup fields, so the count cannot change
  while work is running. "Cambia numero" in the ready state discards the
  pending deck and storage and returns to the form.
- The spinner is decorative; the text carries progress for screen readers.
  Under `prefers-reduced-motion: reduce` the spinner is hidden and only the
  count text updates.

## 4. Copy

All new strings exist in Italian, English, and French. Numbers use the page
language's grouping (`5.000`, `5,000`, `5 000`).

## 5. Out of scope

- Cancelling a generation in progress.
- Web Workers, streaming PDFs, or server-side rendering.
- Changing the PDF layout or the three-cards-per-page rule.
- Virtualizing the chip grid beyond simple pagination.

## 6. Verification

- Node: cap boundaries, async batching/progress/yield, sync/async equivalence,
  PDF deck validation, saved-game restore above the old cap.
- Browser: generate 5,000 cards, see progress and ready state, download, start
  the game, paginate the manager, reload, and switch language.
- `file://` smoke test on both pages.
