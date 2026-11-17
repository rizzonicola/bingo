import test from 'node:test';
import assert from 'node:assert/strict';
import '../assets/cards.js';
import '../assets/pdf.js';

const Cards = globalThis.BingoCards;
const Pdf = globalThis.BingoPdf;

function seeded(seed) {
  return max => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) % max;
  };
}

const cards = Cards.generate(5, seeded(9));

test('builds a valid two-page PDF for five cards', () => {
  const pdf = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  assert.ok(pdf.startsWith('%PDF-1.4'));
  assert.ok(pdf.endsWith('%%EOF\n'));
  assert.match(pdf, /\/Count 2\b/);
  assert.equal((pdf.match(/\/MediaBox \[0 0 595\.28 841\.89\]/g) || []).length, 2);
  for (let n = 1; n <= 5; n += 1) {
    assert.ok(pdf.includes(`(Cartella ${n}) Tj`), `label ${n}`);
  }
  assert.ok(pdf.includes('(Bingo - 5 cartelle)'));
  assert.ok(pdf.includes('(Bingo / 1-90) Tj'));
});

test('writes correct xref offsets', () => {
  const pdf = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  const start = pdf.indexOf('xref\n0 ');
  const end = pdf.indexOf('trailer', start);
  const entries = pdf.slice(start, end).trimEnd().split('\n').slice(2);
  assert.equal(entries[0], '0000000000 65535 f ');
  const objects = [...pdf.matchAll(/(\d+) 0 obj/g)];
  assert.equal(entries.length - 1, objects.length);
  objects.forEach((match, index) => {
    const offset = Number(entries[index + 1].slice(0, 10));
    assert.equal(pdf.slice(offset, offset + match[0].length), match[0]);
  });
  const xref = Number(pdf.match(/startxref\n(\d+)\n%%EOF/)[1]);
  assert.equal(pdf.slice(xref, xref + 4), 'xref');
});

test('uses the theme palette', () => {
  const classic = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  assert.ok(classic.includes('0.051 0.463 0.431 rg'));
  const cream = Pdf.buildPdf({ cards, theme: 'crema', lang: 'it' });
  assert.ok(cream.includes('1 0.98 0.941 rg'));
  const christmas = Pdf.buildPdf({ cards, theme: 'natale', lang: 'it' });
  assert.ok(christmas.includes('0.047 0.09 0.067 rg'));
});

test('black and white uses grayscale operators only', () => {
  const pdf = Pdf.buildPdf({ cards, theme: 'biancoNero', lang: 'it' });
  assert.equal(/\b\d+(?:\.\d+)?(?:\s+\d+(?:\.\d+)?){2}\s+(?:rg|RG)\b/.test(pdf), false);
  assert.ok(/\b0\.702 G\b/.test(pdf));
});

test('localizes labels and metadata', () => {
  const english = Pdf.buildPdf({ cards, theme: 'classico', lang: 'en' });
  assert.ok(english.includes('(Card 1) Tj'));
  assert.ok(english.includes('(Bingo - 5 cards)'));
  const french = Pdf.buildPdf({ cards, theme: 'classico', lang: 'fr' });
  assert.ok(french.includes('(Carte 1) Tj'));
  assert.ok(french.includes('(Bingo - 5 cartes)'));
});

test('is deterministic', () => {
  const first = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  const second = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  assert.equal(first, second);
});

test('unknown theme falls back to Classico', () => {
  const classic = Pdf.buildPdf({ cards, theme: 'classico', lang: 'it' });
  const unknown = Pdf.buildPdf({ cards, theme: 'unknown', lang: 'it' });
  assert.equal(unknown, classic);
});

test('rejects invalid cards and duplicate decks', () => {
  const invalid = cards.map(card => card.map(row => row.slice()));
  const row = invalid[0];
  row[row.findIndex(value => value !== null)] = null;
  assert.throws(() => Pdf.buildPdf({ cards: [invalid[0]], theme: 'classico', lang: 'it' }), /Invalid card/);
  assert.throws(() => Pdf.buildPdf({ cards: [cards[0], cards[0]], theme: 'classico', lang: 'it' }), /Duplicate card/);
  assert.throws(() => Pdf.buildPdf({ cards: [], theme: 'classico', lang: 'it' }), /1 to 100/);
});

test('names the file from the card count', () => {
  assert.equal(Pdf.pdfFilename(24), 'bingo-cartelle-24.pdf');
  assert.equal(Pdf.pdfTitle(3, 'en'), 'Bingo - 3 cards');
});
