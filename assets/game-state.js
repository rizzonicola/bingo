(function (root) {
  'use strict';

  const Cards = root.BingoCards;
  const Prizes = root.BingoPrizes;
  const Pdf = root.BingoPdf;
  const { TOTAL } = root.BingoCommon;

  function createGame(cards, printTheme) {
    return {
      cards,
      printTheme,
      drawn: [],
      disabled: [],
      seen: Prizes.emptySeen(cards.length),
      log: [],
    };
  }

  function loadGame(stored, defaultTheme) {
    if (!stored || !Array.isArray(stored.cards) || stored.cards.length < 1 || stored.cards.length > 100) {
      return null;
    }

    const signatures = new Set();
    for (const card of stored.cards) {
      if (!Cards.validateCard(card)) return null;
      const signature = Cards.gridSignature(card);
      if (signatures.has(signature)) return null;
      signatures.add(signature);
    }

    const drawn = sanitizeDrawn(stored.drawn);
    const drawnSet = new Set(drawn);
    const disabled = sanitizeDisabled(stored.disabled, stored.cards.length);
    const storedSeen = stored.seen && typeof stored.seen === 'object' ? stored.seen : {};
    let seen = Prizes.emptySeen(stored.cards.length);
    for (let index = 0; index < stored.cards.length; index += 1) {
      const number = index + 1;
      const raw = storedSeen[number];
      if (raw && typeof raw === 'object') {
        seen[number] = { rows: raw.rows, bingo: raw.bingo === true };
      }
      seen = Prizes.syncSeen(seen, number, stored.cards[index], drawnSet);
    }

    return {
      cards: stored.cards,
      printTheme: Pdf.THEME_IDS.includes(stored.printTheme) ? stored.printTheme : defaultTheme,
      drawn,
      disabled,
      seen,
      log: sanitizeLog(stored.log, drawn, stored.cards.length),
    };
  }

  function draw(game, number) {
    const drawn = [...game.drawn, number];
    const result = Prizes.detect({
      cards: game.cards,
      drawnSet: new Set(drawn),
      disabled: game.disabled,
      seen: game.seen,
      claimed: claimedTiers(game.log),
    });

    let next = { ...game, drawn, seen: result.seen };
    if (result.awards.length) {
      next = { ...next, log: [...next.log, { number, awards: result.awards }] };
    }
    return { game: next, awards: result.awards };
  }

  function reset(game) {
    return {
      ...game,
      drawn: [],
      log: [],
      seen: Prizes.emptySeen(game.cards.length),
    };
  }

  function toggleCard(game, number) {
    const off = new Set(game.disabled);
    let enabled = false;
    if (off.has(number)) {
      off.delete(number);
      enabled = true;
    } else {
      off.add(number);
    }

    let next = { ...game, disabled: [...off].sort((a, b) => a - b) };
    if (enabled) {
      next = {
        ...next,
        seen: Prizes.syncSeen(next.seen, number, next.cards[number - 1], new Set(next.drawn)),
      };
    }
    return next;
  }

  function applyRange(game, mode, text) {
    const numbers = Cards.parseRanges(text, game.cards.length);
    if (!numbers.length) return { game, changed: false, numbers };

    const off = new Set(game.disabled);
    let next = game;
    let changed = false;
    for (const number of numbers) {
      if (mode === 'disable') {
        if (!off.has(number)) {
          off.add(number);
          changed = true;
        }
      } else if (off.has(number)) {
        off.delete(number);
        next = {
          ...next,
          seen: Prizes.syncSeen(next.seen, number, next.cards[number - 1], new Set(next.drawn)),
        };
        changed = true;
      }
    }

    if (changed) next = { ...next, disabled: [...off].sort((a, b) => a - b) };
    return { game: next, changed, numbers };
  }

  function claimedTiers(log) {
    const tiers = new Set();
    for (const entry of log) {
      for (const award of entry.awards) tiers.add(award.tier);
    }
    return tiers;
  }

  function sanitizeDrawn(values) {
    const seen = new Set();
    const valid = [];
    if (!Array.isArray(values)) return valid;
    for (const value of values) {
      const number = Number(value);
      if (Number.isInteger(number) && number >= 1 && number <= TOTAL && !seen.has(number)) {
        seen.add(number);
        valid.push(number);
      }
    }
    return valid;
  }

  function sanitizeDisabled(values, count) {
    const seen = new Set();
    if (!Array.isArray(values)) return [];
    for (const value of values) {
      const number = Number(value);
      if (Number.isInteger(number) && number >= 1 && number <= count) seen.add(number);
    }
    return [...seen].sort((a, b) => a - b);
  }

  function sanitizeLog(values, drawn, count) {
    const drawnSet = new Set(drawn);
    const tiers = new Set([...Prizes.TIERS, 'bingo']);
    const numbers = new Set();
    const log = [];
    if (!Array.isArray(values)) return log;

    for (const entry of values) {
      if (!entry || typeof entry !== 'object') continue;
      const number = Number(entry.number);
      if (!Number.isInteger(number) || !drawnSet.has(number) || numbers.has(number)) continue;
      if (!Array.isArray(entry.awards)) continue;
      const seenAwards = new Set();
      const awards = [];
      for (const award of entry.awards) {
        if (!award || typeof award !== 'object') continue;
        const card = Number(award.card);
        if (!Number.isInteger(card) || card < 1 || card > count || !tiers.has(award.tier)) continue;
        const key = `${card}:${award.tier}`;
        if (seenAwards.has(key)) continue;
        seenAwards.add(key);
        awards.push({ card, tier: award.tier });
      }
      if (!awards.length) continue;
      numbers.add(number);
      log.push({ number, awards });
    }

    log.sort((a, b) => drawn.indexOf(a.number) - drawn.indexOf(b.number));
    return log;
  }

  root.BingoGameState = {
    createGame,
    loadGame,
    draw,
    reset,
    toggleCard,
    applyRange,
  };
})(globalThis);
