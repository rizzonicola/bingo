(function (root) {
  'use strict';

  const MIN_CARDS = 1;
  const MAX_CARDS = 100;
  const ROWS = 3;
  const COLS = 9;
  const NUMBERS_PER_ROW = 5;
  const MAX_ATTEMPTS = 300;

  function columnRange(column) {
    const start = column === 0 ? 1 : column * 10;
    const end = column === 0 ? 9 : column === COLS - 1 ? 90 : start + 9;
    return [start, end];
  }

  function columnPool(column) {
    const [start, end] = columnRange(column);
    const pool = [];
    for (let n = start; n <= end; n += 1) pool.push(n);
    return pool;
  }

  const COLUMNS = Array.from({ length: COLS }, (_, column) => columnPool(column));

  function generate(count, random = randomIndex) {
    if (!Number.isInteger(count) || count < MIN_CARDS || count > MAX_CARDS) {
      throw new RangeError(`Card count must be an integer from ${MIN_CARDS} to ${MAX_CARDS}.`);
    }

    const cards = [];
    const signatures = new Set();

    for (let i = 0; i < count; i += 1) {
      let card = null;
      for (let attempt = 0; attempt < MAX_ATTEMPTS && !card; attempt += 1) {
        const candidate = createCard(random);
        if (!candidate) continue;
        if (!validateCard(candidate)) continue;
        const signature = gridSignature(candidate);
        if (signatures.has(signature)) continue;
        signatures.add(signature);
        card = candidate;
      }
      if (!card) throw new Error('Unable to generate a unique card.');
      cards.push(card);
    }

    return cards;
  }

  function createCard(random) {
    const selected = [[], [], []];
    for (let row = 0; row < ROWS; row += 1) {
      selected[row] = pickDistinct(COLS, NUMBERS_PER_ROW, random).sort((a, b) => a - b);
    }

    const counts = new Array(COLS).fill(0);
    for (const row of selected) {
      for (const column of row) counts[column] += 1;
    }
    if (counts.some(n => n === 0 || n > 3)) return null;

    const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
    for (let column = 0; column < COLS; column += 1) {
      const rows = [];
      for (let row = 0; row < ROWS; row += 1) {
        if (selected[row].includes(column)) rows.push(row);
      }
      const values = sample(COLUMNS[column], counts[column], random).sort((a, b) => a - b);
      rows.forEach((row, index) => { grid[row][column] = values[index]; });
    }
    return grid;
  }

  function pickDistinct(size, count, random) {
    const pool = Array.from({ length: size }, (_, index) => index);
    for (let i = 0; i < count; i += 1) {
      const index = i + bounded(random, size - i);
      [pool[i], pool[index]] = [pool[index], pool[i]];
    }
    return pool.slice(0, count);
  }

  function sample(values, count, random) {
    const pool = values.slice();
    for (let i = 0; i < count; i += 1) {
      const index = i + bounded(random, pool.length - i);
      [pool[i], pool[index]] = [pool[index], pool[i]];
    }
    return pool.slice(0, count);
  }

  function bounded(random, max) {
    const value = Number(random(max));
    if (!Number.isInteger(value) || value < 0 || value >= max) {
      throw new Error('Random source returned an invalid index.');
    }
    return value;
  }

  function validateCard(grid) {
    if (!Array.isArray(grid) || grid.length !== ROWS) return false;
    const seen = new Set();
    let total = 0;

    for (let row = 0; row < ROWS; row += 1) {
      const values = grid[row];
      if (!Array.isArray(values) || values.length !== COLS) return false;
      let rowCount = 0;
      let previous = 0;
      for (let column = 0; column < COLS; column += 1) {
        const value = values[column];
        if (value === null) continue;
        if (!Number.isInteger(value) || value < 1 || value > 90) return false;
        if (seen.has(value)) return false;
        seen.add(value);
        const [start, end] = columnRange(column);
        if (value < start || value > end) return false;
        if (value <= previous) return false;
        previous = value;
        rowCount += 1;
        total += 1;
      }
      if (rowCount !== NUMBERS_PER_ROW) return false;
    }

    if (total !== 15) return false;
    for (let column = 0; column < COLS; column += 1) {
      let count = 0;
      let previous = 0;
      for (let row = 0; row < ROWS; row += 1) {
        const value = grid[row][column];
        if (value === null) continue;
        if (value <= previous) return false;
        previous = value;
        count += 1;
      }
      if (count < 1 || count > 3) return false;
    }
    return true;
  }

  function gridSignature(grid) {
    return grid.map(row => row.map(value => value === null ? '' : String(value)).join(',')).join('|');
  }

  function parseRanges(text, max) {
    const limit = Number(max);
    if (!Number.isInteger(limit) || limit < 1) return [];
    const found = new Set();
    const parts = String(text == null ? '' : text).split(',');

    for (const part of parts) {
      const token = part.trim().replace(/[\u2013\u2014]/g, '-');
      if (!token) continue;
      const match = token.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!match) continue;
      const start = Number(match[1]);
      const end = match[2] === undefined ? start : Number(match[2]);
      if (start > end || start < 1 || end > limit) continue;
      for (let n = start; n <= end; n += 1) found.add(n);
    }

    return [...found].sort((a, b) => a - b);
  }

  function randomIndex(max) {
    if (root.crypto && typeof root.crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / max) * max;
      do {
        root.crypto.getRandomValues(buffer);
      } while (buffer[0] >= limit);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  const api = {
    generate,
    validateCard,
    gridSignature,
    parseRanges,
  };

  root.BingoCards = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
