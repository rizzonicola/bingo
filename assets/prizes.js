(function (root) {
  'use strict';

  const TIERS = ['ambo', 'terna', 'quaterna', 'cinquina'];
  const TIER_ORDER = ['bingo', 'cinquina', 'quaterna', 'terna', 'ambo'];
  const ROW_TIERS = { 2: 'ambo', 3: 'terna', 4: 'quaterna', 5: 'cinquina' };

  function emptySeen(count) {
    const seen = {};
    for (let card = 1; card <= count; card += 1) {
      seen[card] = { rows: [0, 0, 0], bingo: false };
    }
    return seen;
  }

  function rowCounts(grid, drawn) {
    return grid.map(row => row.reduce(
      (total, value) => total + (value !== null && drawn.has(value) ? 1 : 0),
      0
    ));
  }

  function normalize(entry) {
    const rows = Array.isArray(entry && entry.rows) ? entry.rows : [];
    return {
      rows: [0, 1, 2].map(row => {
        const value = Number(rows[row]);
        return Number.isInteger(value) ? Math.min(5, Math.max(0, value)) : 0;
      }),
      bingo: Boolean(entry && entry.bingo),
    };
  }

  function syncSeen(seen, cardNumber, grid, drawnSet) {
    const drawn = drawnSet instanceof Set ? drawnSet : new Set(drawnSet || []);
    const counts = rowCounts(grid, drawn);
    const entry = normalize(seen[cardNumber]);
    const total = counts.reduce((sum, count) => sum + count, 0);
    return {
      ...seen,
      [cardNumber]: {
        rows: counts.map((count, row) => Math.max(count, entry.rows[row])),
        bingo: entry.bingo || total === 15,
      },
    };
  }

  function detect({ cards, drawnSet, disabled, seen }) {
    const drawn = drawnSet instanceof Set ? drawnSet : new Set(drawnSet || []);
    const off = disabled instanceof Set ? disabled : new Set(disabled || []);
    const current = seen || {};
    const next = { ...current };
    const awards = [];

    cards.forEach((grid, index) => {
      const cardNumber = index + 1;
      if (off.has(cardNumber)) return;

      const counts = rowCounts(grid, drawn);
      const entry = normalize(current[cardNumber]);
      const rows = entry.rows.slice();
      let bingo = entry.bingo;

      counts.forEach((count, row) => {
        if (count < 2 || count <= rows[row]) return;
        const tier = ROW_TIERS[Math.min(5, count)];
        if (!tier) return;
        awards.push({ card: cardNumber, tier });
        rows[row] = Math.min(5, count);
      });

      const total = counts.reduce((sum, count) => sum + count, 0);
      if (total === 15 && !bingo) {
        awards.push({ card: cardNumber, tier: 'bingo' });
        bingo = true;
      }

      next[cardNumber] = { rows, bingo };
    });

    awards.sort((a, b) => {
      const tier = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
      return tier !== 0 ? tier : a.card - b.card;
    });

    return { seen: next, awards };
  }

  const api = {
    TIERS,
    TIER_ORDER,
    emptySeen,
    syncSeen,
    detect,
  };

  root.BingoPrizes = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
