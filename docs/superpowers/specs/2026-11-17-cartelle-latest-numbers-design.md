# Cartelle: latest numbers and prize touch scroll

Small change to the Cartelle mode. The main board is untouched.

## Intent

- The referee wants the main board's “Ultimi estratti” panel in Cartelle too, to
  recall the numbers just called.
- On a phone, a touch drag that starts on the previous-prize entries does not
  scroll the page: that list is its own scroll box with scroll chaining
  disabled.

## Decisions

- Add an “Ultimi estratti” panel with the last 12 drawn numbers, newest first,
  same chips as the main board. It sits under the board on desktop; on phones
  the order is stage, latest prizes, board, latest numbers, previous prizes.
- The panel has no saved footer: the previous-prizes panel already carries it.
- The prize log stops being an inner scroll box on phones; it grows with its
  content and the page scrolls. Where it still scrolls, normal scroll chaining
  is allowed so the page is never trapped.
- No new state. The panel reads `game.drawn` and updates on every draw, on
  reload, and on reset.

## Behavior

- Before the first draw: “I numeri compaiono qui appena escono.”
- The newest number is highlighted and the new chip animates; reduced motion
  keeps the existing static treatment.
- The list is visual only. The draw announcement already names the number.
- Copy exists in Italian, English, and French, reusing the main board wording.

## Scope

- `cartelle.html`: history section under the board.
- `assets/cartelle.css`: history layout and the phone scroll fix.
- `assets/cartelle.js`: render the recent numbers, add the two copy keys.
- Browser tests: history after draw, reload, reset; touch drag over previous
  prize entries moves the page.
- Docs: spec, plan, `PRODUCT.md`, `DESIGN.md`, `README.md`.

## Non-goals

- No change to the main board.
- No scrollable history, no full drawn-number archive, no new persistence.
