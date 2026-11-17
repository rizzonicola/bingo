import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/cards.js';
import '../assets/prizes.js';
import '../assets/pdf.js';
import '../assets/common.js';
import '../assets/game-state.js';

const Prizes = globalThis.BingoPrizes;
const State = globalThis.BingoGameState;

const CARD = [
  [3, 12, null, 34, 41, null, null, null, 88],
  [null, 17, 20, null, null, 52, 63, 71, null],
  [8, null, 27, null, 49, 58, null, 79, null],
];

test('loadGame sanitizes drawn numbers, disabled cards, seen, and log', () => {
  const stored = {
    cards: [CARD],
    printTheme: 'nope',
    drawn: [3, 12, 12, 91, '4'],
    disabled: [1, 1, 2],
    seen: { 1: { rows: [1, 0, 0], bingo: false } },
    log: [
      {
        number: 12,
        awards: [
          { card: 1, tier: 'ambo' },
          { card: 1, tier: 'ambo' },
          { card: 99, tier: 'ambo' },
          { card: 1, tier: 'nope' },
        ],
      },
      { number: 77, awards: [{ card: 1, tier: 'ambo' }] },
      'junk',
    ],
  };

  const game = State.loadGame(stored, 'classico');
  assert.deepEqual(game.drawn, [3, 12, 4]);
  assert.deepEqual(game.disabled, [1]);
  assert.equal(game.printTheme, 'classico');
  assert.deepEqual(game.log, [{ number: 12, awards: [{ card: 1, tier: 'ambo' }] }]);
  assert.equal(game.seen[1].rows[0], 2);
  assert.equal(game.seen[1].bingo, false);
});

test('loadGame rejects duplicate or malformed cards', () => {
  assert.equal(State.loadGame({ cards: [CARD, CARD] }, 'classico'), null);

  const broken = CARD.map(row => row.slice());
  broken[0][0] = 10;
  assert.equal(State.loadGame({ cards: [broken] }, 'classico'), null);
  assert.equal(State.loadGame({ cards: [] }, 'classico'), null);
  assert.equal(State.loadGame(null, 'classico'), null);
});

test('draw appends one log entry and claims each tier once', () => {
  const start = State.createGame([CARD], 'classico');
  const first = State.draw({ ...start, drawn: [3] }, 12);
  assert.deepEqual(first.awards, [{ card: 1, tier: 'ambo' }]);
  assert.deepEqual(first.game.drawn, [3, 12]);
  assert.deepEqual(first.game.log, [{ number: 12, awards: [{ card: 1, tier: 'ambo' }] }]);
  assert.deepEqual(start.drawn, []);

  const second = State.draw(first.game, 34);
  assert.deepEqual(second.awards, [{ card: 1, tier: 'terna' }]);
  assert.equal(second.game.log.length, 2);
  assert.equal(second.game.log[1].number, 34);
});

test('reset clears the game but keeps cards and disabled cards', () => {
  const played = {
    ...State.createGame([CARD], 'classico'),
    drawn: [3, 12],
    disabled: [1],
    seen: { 1: { rows: [2, 0, 0], bingo: false } },
    log: [{ number: 12, awards: [{ card: 1, tier: 'ambo' }] }],
  };

  const game = State.reset(played);
  assert.deepEqual(game.drawn, []);
  assert.deepEqual(game.log, []);
  assert.deepEqual(game.disabled, [1]);
  assert.equal(game.cards, played.cards);
  assert.deepEqual(game.seen, Prizes.emptySeen(1));
  assert.deepEqual(played.drawn, [3, 12]);
});

test('toggleCard disables and re-enables a card, syncing seen on enable', () => {
  const start = {
    ...State.createGame([CARD], 'classico'),
    drawn: [3],
    seen: Prizes.syncSeen(State.createGame([CARD], 'classico').seen, 1, CARD, new Set([3])),
  };

  const disabled = State.toggleCard(start, 1);
  assert.deepEqual(disabled.disabled, [1]);
  assert.deepEqual(start.disabled, []);

  const enabled = State.toggleCard(disabled, 1);
  assert.deepEqual(enabled.disabled, []);
  assert.equal(enabled.seen[1].rows[0], 1);
});

test('applyRange parses, disables, re-enables, and rejects invalid input', () => {
  const start = State.createGame([CARD, CARD, CARD, CARD, CARD], 'classico');

  const disabled = State.applyRange(start, 'disable', '2-3, 5');
  assert.deepEqual(disabled.numbers, [2, 3, 5]);
  assert.equal(disabled.changed, true);
  assert.deepEqual(disabled.game.disabled, [2, 3, 5]);

  const invalid = State.applyRange(start, 'disable', '0-2');
  assert.deepEqual(invalid.numbers, []);
  assert.equal(invalid.changed, false);
  assert.equal(invalid.game, start);

  const drawn = {
    ...disabled.game,
    drawn: [3],
    seen: Prizes.syncSeen(disabled.game.seen, 2, CARD, new Set([3])),
  };
  const enabled = State.applyRange(drawn, 'enable', '2-3');
  assert.deepEqual(enabled.game.disabled, [5]);
  assert.equal(enabled.game.seen[2].rows[0], 1);
});
