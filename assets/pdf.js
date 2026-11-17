(function (root) {
  'use strict';

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN = 36;
  const GAP = 14;
  const CARD_W = 523.28;
  const CARD_H = 228;
  const HEADER_H = 30;
  const TABLE_H = 180;
  const FOOTER_H = 18;
  const CARDS_PER_PAGE = 3;
  const COL_W = CARD_W / 9;
  const ROW_H = TABLE_H / 3;
  const TOP_MARGIN = (PAGE_H - (CARDS_PER_PAGE * CARD_H + (CARDS_PER_PAGE - 1) * GAP)) / 2;

  const THEMES = {
    classico: {
      labelKey: 'themeClassico',
      header: [13, 118, 110],
      headerInk: [245, 251, 248],
      numberInk: [26, 33, 34],
      grid: [199, 210, 207],
      cell: [255, 255, 255],
      accent: [13, 118, 110],
    },
    natale: {
      labelKey: 'themeNatale',
      header: [12, 23, 17],
      headerInk: [232, 195, 117],
      numberInk: [31, 49, 40],
      grid: [207, 199, 180],
      cell: [255, 255, 255],
      accent: [168, 130, 60],
    },
    crema: {
      labelKey: 'themeCrema',
      header: [241, 232, 216],
      headerInk: [143, 29, 23],
      numberInk: [31, 49, 40],
      grid: [216, 203, 184],
      cell: [255, 250, 240],
      accent: [179, 38, 30],
    },
    biancoNero: {
      labelKey: 'themeBiancoNero',
      header: [26, 26, 26],
      headerInk: [255, 255, 255],
      numberInk: [0, 0, 0],
      grid: [179, 179, 179],
      cell: [255, 255, 255],
      accent: [26, 26, 26],
    },
  };

  const THEME_IDS = Object.keys(THEMES);
  const LABELS = {
    it: { card: 'Cartella', title: 'cartelle' },
    en: { card: 'Card', title: 'cards' },
    fr: { card: 'Carte', title: 'cartes' },
  };
  const DIGIT_WIDTH = 556;
  const HEADER_RIGHT_WIDTH = { Helvetica: 2557, 'Helvetica-Bold': 2833 };

  function buildPdf({ cards, theme, lang }) {
    const Cards = root.BingoCards;
    if (!Cards) throw new Error('Card module is unavailable.');
    if (!Array.isArray(cards) || cards.length < 1 || cards.length > 100) {
      throw new Error('A deck must contain 1 to 100 cards.');
    }

    const signatures = new Set();
    for (const card of cards) {
      if (!Cards.validateCard(card)) throw new Error('Invalid card.');
      const signature = Cards.gridSignature(card);
      if (signatures.has(signature)) throw new Error('Duplicate card.');
      signatures.add(signature);
    }

    const code = LABELS[lang] ? lang : 'it';
    const labels = LABELS[code];
    const themeId = THEME_IDS.includes(theme) ? theme : 'classico';
    const palette = THEMES[themeId];
    const pageCount = Math.ceil(cards.length / CARDS_PER_PAGE);

    const objects = [];
    const add = body => {
      objects.push(body);
      return objects.length;
    };

    add('<< /Type /Catalog /Pages 2 0 R >>');
    add('');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    add(`<< /Title (${pdfString(pdfTitle(cards.length, code))}) /Author (Bingo) /Producer (Bingo) >>`);

    const kids = [];
    for (let page = 0; page < pageCount; page += 1) {
      const pageCards = cards.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
      const content = pageContent(pageCards, page * CARDS_PER_PAGE, labels, palette);
      const contentNumber = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
      const pageNumber = add(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`
      );
      kids.push(pageNumber);
    }

    objects[1] = `<< /Type /Pages /Kids [${kids.map(number => `${number} 0 R`).join(' ')}] /Count ${kids.length} >>`;

    const parts = ['%PDF-1.4\n'];
    const offsets = [0];
    let length = parts[0].length;
    objects.forEach((body, index) => {
      offsets.push(length);
      const chunk = `${index + 1} 0 obj\n${body}\nendobj\n`;
      parts.push(chunk);
      length += chunk.length;
    });

    const xrefOffset = length;
    parts.push(`xref\n0 ${objects.length + 1}\n`);
    parts.push('0000000000 65535 f \n');
    for (let i = 1; i <= objects.length; i += 1) {
      parts.push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
    }
    parts.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

    return parts.join('');
  }

  function pageContent(cards, startIndex, labels, palette) {
    const lines = ['q'];

    cards.forEach((card, index) => {
      const cardNumber = startIndex + index + 1;
      const top = PAGE_H - TOP_MARGIN - index * (CARD_H + GAP);
      const tableTop = top - HEADER_H;
      const bottom = top - CARD_H;

      lines.push(color(palette.cell, false));
      lines.push(`${n(MARGIN)} ${n(tableTop - TABLE_H)} ${n(CARD_W)} ${n(TABLE_H)} re f`);

      lines.push(color(palette.header, false));
      lines.push(`${n(MARGIN)} ${n(top - HEADER_H)} ${n(CARD_W)} ${n(HEADER_H)} re f`);

      lines.push(color(palette.accent, false));
      lines.push(`${n(MARGIN)} ${n(tableTop - 2)} ${n(CARD_W)} 2 re f`);

      lines.push('0.75 w');
      lines.push(color(palette.grid, true));
      lines.push(`${n(MARGIN)} ${n(bottom)} ${n(CARD_W)} ${n(CARD_H)} re S`);

      lines.push('0.4 w');
      for (let column = 1; column < 9; column += 1) {
        const x = MARGIN + column * COL_W;
        lines.push(`${n(x)} ${n(tableTop - TABLE_H)} m ${n(x)} ${n(tableTop)} l S`);
      }
      for (let row = 1; row < 3; row += 1) {
        const y = tableTop - row * ROW_H;
        lines.push(`${n(MARGIN)} ${n(y)} m ${n(MARGIN + CARD_W)} ${n(y)} l S`);
      }

      lines.push(text(`/${'F2'} 15 Tf`, palette.headerInk, MARGIN + 14, top - 20.5,
        `${labels.card} ${cardNumber}`));

      const right = 'Bingo';
      const rightWidth = (HEADER_RIGHT_WIDTH['Helvetica-Bold'] / 1000) * 9;
      lines.push(text('/F2 9 Tf', palette.headerInk, MARGIN + CARD_W - 14 - rightWidth, top - 19.5, right));

      card.forEach((row, rowIndex) => {
        row.forEach((value, columnIndex) => {
          if (value === null) return;
          const x = MARGIN + columnIndex * COL_W + COL_W / 2 - (2 * DIGIT_WIDTH / 1000 * 20) / 2;
          const y = tableTop - rowIndex * ROW_H - ROW_H / 2 - 7;
          lines.push(text('/F2 20 Tf', palette.numberInk, x, y, String(value)));
        });
      });

      lines.push(text('/F1 7.5 Tf', palette.numberInk, MARGIN + 14, bottom + 6.5, 'Bingo / 1-90'));
    });

    lines.push('Q');
    return lines.join('\n');
  }

  function text(font, rgb, x, y, value) {
    return `BT\n${font}\n${color(rgb, false)}\n1 0 0 1 ${n(x)} ${n(y)} Tm\n(${pdfString(value)}) Tj\nET`;
  }

  function color(rgb, stroke) {
    const [r, g, b] = rgb;
    if (r === g && g === b) return `${n(r / 255)} ${stroke ? 'G' : 'g'}`;
    return `${n(r / 255)} ${n(g / 255)} ${n(b / 255)} ${stroke ? 'RG' : 'rg'}`;
  }

  function n(value) {
    return String(Math.round(value * 1000) / 1000);
  }

  function pdfString(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function pdfTitle(count, lang) {
    const code = LABELS[lang] ? lang : 'it';
    return `Bingo - ${count} ${LABELS[code].title}`;
  }

  function pdfFilename(count) {
    return `bingo-cartelle-${count}.pdf`;
  }

  const api = {
    PAGE_W,
    PAGE_H,
    THEMES,
    THEME_IDS,
    buildPdf,
    pdfTitle,
    pdfFilename,
  };

  root.BingoPdf = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
