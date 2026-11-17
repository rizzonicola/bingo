import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/cards.js';
import '../assets/prizes.js';

const Cards = globalThis.BingoCards;
const Prizes = globalThis.BingoPrizes;

const CARD = [
  [3, 12, null, 34, 41, null, null, null, 88],
  [null, 17, 20, null, null, 52, 63, 71, null],
  [8, null, 27, null, 49, 58, null, 79, null],
];

function seeded(seed) {
  return max => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) % max;
  };
}

function draw(seen, numbers, extra = {}) {
  return Prizes.detect({
    cards: [CARD],
    drawnSet: new Set(numbers),
    disabled: extra.disabled || [],
    seen,
  });
}

test('emptySeen covers every card', () => {
  assert.deepEqual(Prizes.emptySeen(2), {
    1: { rows: [0, 0, 0], bingo: false },
    2: { rows: [0, 0, 0], bingo: false },
  });
});

test('awards row thresholds once, in order', () => {
  let seen = Prizes.emptySeen(1);
  const cases = [
    [[3, 12], 'ambo'],
    [[3, 12, 34], 'terna'],
    [[3, 12, 34, 41], 'quaterna'],
    [[3, 12, 34, 41, 88], 'cinquina'],
  ];
  for (const [numbers, tier] of cases) {
    const result = draw(seen, numbers);
    assert.deepEqual(result.awards, [{ card: 1, tier }]);
    seen = result.seen;
  }
  assert.deepEqual(draw(seen, [3, 12, 34, 41, 88]).awards, []);
});

test('the last number awards a row and Bingo together', () => {
  const before = [
    3, 12, 34, 41, 88,
    17, 20, 52, 63, 71,
    8, 27, 49, 58,
  ];
  let seen = Prizes.emptySeen(1);
  seen = draw(seen, before).seen;
  const result = draw(seen, [...before, 79]);
  assert.deepEqual(result.awards, [
    { card: 1, tier: 'bingo' },
    { card: 1, tier: 'cinquina' },
  ]);
  assert.equal(result.seen[1].bingo, true);
  assert.deepEqual(draw(result.seen, [...before, 79]).awards, []);
});

test('disabled cards produce no awards', () => {
  let seen = Prizes.emptySeen(1);
  const result = Prizes.detect({
    cards: [CARD],
    drawnSet: new Set([3, 12]),
    disabled: [1],
    seen,
  });
  assert.deepEqual(result.awards, []);
  assert.deepEqual(result.seen, seen);
});

test('sync suppresses thresholds passed while disabled', () => {
  let seen = Prizes.emptySeen(1);
  seen = Prizes.syncSeen(seen, 1, CARD, new Set([3, 12, 34, 41]));
  assert.deepEqual(seen[1], { rows: [4, 0, 0], bingo: false });

  const result = draw(seen, [3, 12, 34, 41, 88]);
  assert.deepEqual(result.awards, [{ card: 1, tier: 'cinquina' }]);
});

test('a jump to a later threshold only announces that threshold', () => {
  const seen = Prizes.emptySeen(1);
  seen[1].rows[0] = 2;
  const result = draw(seen, [3, 12, 34, 41, 88]);
  assert.deepEqual(result.awards, [{ card: 1, tier: 'cinquina' }]);
});

test('multiple cards at the same tier are sorted by card number', () => {
  let cards;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    cards = Cards.generate(2, seeded(10 + attempt));
    const left = new Set(cards[0][0].filter(value => value !== null));
    const right = cards[1][0].filter(value => value !== null);
    if (right.every(value => !left.has(value))) break;
  }
  const picked = cards.map(card => card[0].filter(value => value !== null).slice(0, 2));
  const drawn = new Set(picked.flat());
  const result = Prizes.detect({
    cards,
    drawnSet: drawn,
    disabled: [],
    seen: Prizes.emptySeen(2),
  });
  assert.deepEqual(result.awards, [
    { card: 1, tier: 'ambo' },
    { card: 2, tier: 'ambo' },
  ]);
});

test('detect does not mutate the input seen object', () => {
  const seen = Prizes.emptySeen(1);
  const snapshot = JSON.parse(JSON.stringify(seen));
  Prizes.detect({ cards: [CARD], drawnSet: new Set([3, 12]), disabled: [], seen });
  assert.deepEqual(seen, snapshot);
});
