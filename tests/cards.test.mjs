import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/cards.js';

const Cards = globalThis.BingoCards;

function seeded(seed) {
  return max => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) % max;
  };
}

const COLUMN_RANGES = [
  [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
  [50, 59], [60, 69], [70, 79], [80, 90],
];

test('generates 100 valid, unique cards', () => {
  const cards = Cards.generate(100);
  assert.equal(cards.length, 100);
  const signatures = new Set();
  for (const card of cards) {
    assert.equal(Cards.validateCard(card), true);
    const signature = Cards.gridSignature(card);
    assert.equal(signatures.has(signature), false);
    signatures.add(signature);

    for (const row of card) {
      assert.equal(row.filter(value => value !== null).length, 5);
    }
    for (let column = 0; column < 9; column += 1) {
      const values = card.map(row => row[column]).filter(value => value !== null);
      assert.ok(values.length >= 1 && values.length <= 3);
      const [start, end] = COLUMN_RANGES[column];
      for (const value of values) assert.ok(value >= start && value <= end);
      assert.deepEqual(values, [...values].sort((a, b) => a - b));
    }
    const numbers = card.flat().filter(value => value !== null);
    assert.equal(numbers.length, 15);
    assert.equal(new Set(numbers).size, 15);
  }
});

test('validation rejects 10 in the first column and descending columns', () => {
  const card = Cards.generate(12, seeded(11)).find(candidate => !candidate.flat().includes(10));
  assert.ok(card, 'a card without 10');

  const wrongRange = card.map(row => row.slice());
  wrongRange[0][0] = 10;
  assert.equal(Cards.validateCard(wrongRange), false);

  const descending = card.map(row => row.slice());
  const column = descending[0].findIndex((value, index) =>
    value !== null && descending[1][index] !== null);
  [descending[0][column], descending[1][column]] = [descending[1][column], descending[0][column]];
  assert.equal(Cards.validateCard(descending), false);
});

test('is deterministic with a seeded random source', () => {
  const first = Cards.generate(12, seeded(42));
  const second = Cards.generate(12, seeded(42));
  assert.deepEqual(first, second);
});

test('rejects counts outside 1..100', () => {
  for (const count of [0, 101, -1, 1.5, NaN]) {
    assert.throws(() => Cards.generate(count), RangeError);
  }
});

test('validates card structure and rejects malformed grids', () => {
  const [card] = Cards.generate(1, seeded(7));
  assert.equal(Cards.validateCard(card), true);
  assert.equal(Cards.validateCard(null), false);
  assert.equal(Cards.validateCard(card.slice(0, 2)), false);

  const duplicate = card.map(row => row.slice());
  const first = duplicate[0].findIndex(value => value !== null);
  const second = duplicate[1].findIndex(value => value !== null);
  duplicate[1][second] = duplicate[0][first];
  assert.equal(Cards.validateCard(duplicate), false);

  const unsorted = card.map(row => row.slice());
  let a = unsorted[0].findIndex(value => value !== null);
  let b = unsorted[0].findIndex((value, index) => value !== null && index > a);
  if (b !== -1) {
    [unsorted[0][a], unsorted[0][b]] = [unsorted[0][b], unsorted[0][a]];
    assert.equal(Cards.validateCard(unsorted), false);
  }

  const wrongColumn = card.map(row => row.slice());
  const column = wrongColumn[0].findIndex(value => value !== null);
  const row = wrongColumn.findIndex(values => values[column] !== null);
  wrongColumn[row][column] = column === 0 ? 10 : 1;
  assert.equal(Cards.validateCard(wrongColumn), false);
});

test('parses comma-separated numbers and ranges', () => {
  assert.deepEqual(Cards.parseRanges('8-10, 27', 30), [8, 9, 10, 27]);
  assert.deepEqual(Cards.parseRanges(' 8 – 10 ,27 ', 30), [8, 9, 10, 27]);
  assert.deepEqual(Cards.parseRanges('8—10, 27', 30), [8, 9, 10, 27]);
  assert.deepEqual(Cards.parseRanges('10-8', 30), []);
  assert.deepEqual(Cards.parseRanges('0, 31, x', 30), []);
  assert.deepEqual(Cards.parseRanges('30', 30), [30]);
  assert.deepEqual(Cards.parseRanges('', 30), []);
  assert.deepEqual(Cards.parseRanges('5, 5, 5-6', 30), [5, 6]);
});
