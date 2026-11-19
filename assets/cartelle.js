(() => {
  'use strict';

  const {
    TOTAL,
    PREFS_KEY,
    LANGUAGE_NAMES,
    randomIndex,
    readStored,
    writeStored,
    removeStored,
    storageAvailable,
    loadPrefs,
    detectSystemLanguage,
    applyTheme: applyThemeToDocument,
    applyLanguage: applyLanguageToPage,
    syncControls,
    bindSettings,
    openDialog,
    closeDialog,
    syncModalLock,
    bindShortcut,
  } = globalThis.BingoCommon;

  const NAMES = globalThis.BINGO_NAMES || [];
  const Cards = globalThis.BingoCards;
  const Prizes = globalThis.BingoPrizes;
  const Pdf = globalThis.BingoPdf;
  const State = globalThis.BingoGameState;

  // The main board keeps its own key; the card game is a separate game.
  const STATE_KEY = 'bingo.cards.v1';
  const DEFAULT_COUNT = 12;
  const DEFAULT_THEME = 'classico';
  const PAGE_SIZE = 200;
  const NUMBER_LOCALES = { it: 'it-IT', en: 'en-GB', fr: 'fr-FR' };

  function joinList(values, word) {
    const list = values.map(String);
    if (list.length < 2) return list[0] || '';
    if (list.length === 2) return `${list[0]} ${word} ${list[1]}`;
    return `${list.slice(0, -1).join(', ')} ${word} ${list[list.length - 1]}`;
  }

  const COPY = {
    it: {
      ...BINGO_COPY.it,
      docTitle: 'Cartelle del bingo da stampare in PDF, gratis',
      docDescription: 'Genera fino a 5.000 cartelle numerate e scarica il PDF A4 da stampare: tre per pagina, con ambo, terna, quaterna, cinquina e bingo. Gratis, senza registrazione.',
      ogTitle: 'Cartelle del bingo da stampare in PDF, gratis',
      ogDescription: 'Genera fino a 5.000 cartelle numerate, scarica il PDF A4 e segui ambo, terna, quaterna, cinquina e bingo.',
      skip: 'Vai alle cartelle',
      board: 'Tabellone',
      boardLink: 'Torna al tabellone',
      setupTitle: 'Cartelle del bingo da stampare',
      setupIntro: 'Scegli quante cartelle servono, scarica il PDF e stampalo. Poi chiama i numeri da questa schermata.',
      gameTitle: 'Cartelle del bingo',
      gameIntro: 'Chiama i numeri uno alla volta. I premi valgono solo per le cartelle attive.',
      count: 'Numero di cartelle',
      countMinus: 'Una cartella in meno',
      countPlus: 'Una cartella in più',
      countHint: max => `Da 1 a ${max}.`,
      cardTheme: 'Tema delle cartelle',
      pdfOnly: 'Solo per il PDF.',
      generate: 'Genera le cartelle',
      download: 'Scarica il PDF',
      preparing: 'Preparo le cartelle…',
      generating: (done, total) => `Genero ${done} di ${total} cartelle…`,
      generatingPdf: 'Preparo il PDF…',
      readyTitle: n => `${n} cartelle pronte.`,
      readyNote: 'Scarica il PDF e stampalo. Poi chiama i numeri da qui.',
      changeCount: 'Cambia numero',
      setupNote: 'PDF A4 · 3 cartelle per pagina. La generazione può richiedere qualche secondo.',
      generateError: 'Non è stato possibile generare il PDF. Riprova.',
      generatedAnnounce: n => `${n} cartelle generate. PDF scaricato.`,
      themeClassico: 'Classico',
      themeNatale: 'Natale',
      themeCrema: 'Crema',
      themeBiancoNero: 'Bianco e nero',
      cardsTrigger: n => `Cartelle · ${formatNumber(n)} ${n === 1 ? 'attiva' : 'attive'}`,
      latestPrizes: 'Premi di questa estrazione',
      latestBefore: 'I premi compaiono dopo la prima estrazione.',
      latestNoPrize: 'Nessun premio a questa estrazione.',
      noActive: 'Nessuna cartella attiva: i premi non verranno cercati.',
      previousPrizes: 'Premi precedenti',
      previousEmpty: 'Le estrazioni con premi compaiono qui.',
      resetBody: 'Tutti i numeri tornano disponibili e i premi si azzerano. Le cartelle restano le stesse.',
      resetAnnounce: 'Partita azzerata. I 90 numeri sono di nuovo disponibili.',
      cardsTitle: 'Cartelle',
      cardsLede: 'Disattiva le cartelle che non hai distribuito: i premi vengono cercati solo tra quelle attive. Ogni premio va alle prime cartelle che lo raggiungono.',
      cardsSummary: (active, off) => `${formatNumber(active)} ${active === 1 ? 'attiva' : 'attive'} · ${formatNumber(off)} ${off === 1 ? 'non distribuita' : 'non distribuite'}`,
      ranges: 'Intervalli',
      rangeHint: 'Per esempio 8-20, 27',
      disable: 'Disattiva',
      enable: 'Riattiva',
      rangeError: max => `Scrivi numeri o intervalli tra 1 e ${max}.`,
      cardsGridLabel: 'Scegli le cartelle attive',
      cardsLegend: 'Piena: attiva. Tratteggiata: non distribuita.',
      cardChip: (n, active) => `Cartella ${n}, ${active ? 'attiva' : 'non distribuita'}`,
      pages: 'Pagine delle cartelle',
      pagePrev: 'Pagina precedente',
      pageNext: 'Pagina successiva',
      pageRange: (from, to, total) => `${from}–${to} di ${total}`,
      redownload: 'Scarica di nuovo il PDF',
      redownloadError: 'Non è stato possibile scaricare il PDF. Riprova.',
      newCards: 'Nuove cartelle',
      newCardsTitle: 'Generare nuove cartelle?',
      newCardsBody: 'La partita in corso e le cartelle attuali vengono eliminate. Le cartelle già stampate non saranno più valide.',
      newCardsConfirm: 'Genera nuove cartelle',
      tierAmbo: 'Ambo',
      tierTerna: 'Terna',
      tierQuaterna: 'Quaterna',
      tierCinquina: 'Cinquina',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} sulla cartella ${cards[0]}.`
        : `${tier} sulle cartelle ${joinList(cards, 'e')}.`,
      logMeta: (n, number) => `${n}ª · ${number}`,
    },
    en: {
      ...BINGO_COPY.en,
      docTitle: 'Cards · Bingo',
      docDescription: 'Generate and print bingo cards, then call the numbers and follow the prizes. Cards that were not handed out stay out of the game.',
      ogTitle: 'Cards · Bingo',
      ogDescription: 'Generate the cards, download the PDF, and follow the prizes as you call the numbers.',
      skip: 'Skip to the cards',
      board: 'Board',
      boardLink: 'Back to the board',
      setupTitle: 'Prepare the cards',
      setupIntro: 'Choose how many cards you need, download the PDF, and print it. Then call the numbers from this screen.',
      gameTitle: 'Cards',
      gameIntro: 'Call the numbers one at a time. Prizes count only for active cards.',
      count: 'Number of cards',
      countMinus: 'One card less',
      countPlus: 'One more card',
      countHint: max => `From 1 to ${max}.`,
      cardTheme: 'Card theme',
      pdfOnly: 'For the PDF only.',
      generate: 'Generate cards',
      download: 'Download PDF',
      preparing: 'Preparing the cards…',
      generating: (done, total) => `Generating ${done} of ${total} cards…`,
      generatingPdf: 'Preparing the PDF…',
      readyTitle: n => `${n} cards ready.`,
      readyNote: 'Download the PDF and print it. Then call the numbers from here.',
      changeCount: 'Change number',
      setupNote: 'A4 PDF · 3 cards per page. Generation can take a few seconds.',
      generateError: 'Could not generate the PDF. Try again.',
      generatedAnnounce: n => `${n} cards generated. PDF downloaded.`,
      themeClassico: 'Classic',
      themeNatale: 'Christmas',
      themeCrema: 'Cream',
      themeBiancoNero: 'Black and white',
      cardsTrigger: n => `Cards · ${formatNumber(n)} active`,
      latestPrizes: 'Prizes on this draw',
      latestBefore: 'Prizes appear after the first draw.',
      latestNoPrize: 'No prizes on this draw.',
      noActive: 'No active cards: prizes will not be checked.',
      previousPrizes: 'Previous prizes',
      previousEmpty: 'Draws with prizes appear here.',
      resetBody: 'Every number becomes available again and the prizes are cleared. The cards stay the same.',
      resetAnnounce: 'Game cleared. All 90 numbers are available again.',
      cardsTitle: 'Cards',
      cardsLede: 'Disable the cards you did not hand out: prizes are checked only on active cards. Each prize goes to the first cards that reach it.',
      cardsSummary: (active, off) => `${formatNumber(active)} active · ${formatNumber(off)} not distributed`,
      ranges: 'Ranges',
      rangeHint: 'For example 8-20, 27',
      disable: 'Disable',
      enable: 'Enable',
      rangeError: max => `Write numbers or ranges from 1 to ${max}.`,
      cardsGridLabel: 'Choose the active cards',
      cardsLegend: 'Solid: active. Dashed: not distributed.',
      cardChip: (n, active) => `Card ${n}, ${active ? 'active' : 'not distributed'}`,
      pages: 'Card pages',
      pagePrev: 'Previous page',
      pageNext: 'Next page',
      pageRange: (from, to, total) => `${from}–${to} of ${total}`,
      redownload: 'Download the PDF again',
      redownloadError: 'Could not download the PDF. Try again.',
      newCards: 'New cards',
      newCardsTitle: 'Generate new cards?',
      newCardsBody: 'The current game and the current cards will be deleted. Cards already printed will no longer be valid.',
      newCardsConfirm: 'Generate new cards',
      tierAmbo: 'Pair',
      tierTerna: 'Trio',
      tierQuaterna: 'Quartet',
      tierCinquina: 'Line',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} on card ${cards[0]}.`
        : `${tier} on cards ${joinList(cards, 'and')}.`,
      logMeta: (n, number) => `Draw ${n} · ${number}`,
    },
    fr: {
      ...BINGO_COPY.fr,
      docTitle: 'Cartes · Bingo',
      docDescription: 'Générez et imprimez les cartes du bingo, puis tirez les numéros et suivez les prix. Les cartes non distribuées restent hors du jeu.',
      ogTitle: 'Cartes · Bingo',
      ogDescription: 'Générez les cartes, téléchargez le PDF et suivez les prix pendant que vous tirez les numéros.',
      skip: 'Aller aux cartes',
      board: 'Tableau',
      boardLink: 'Retour au tableau',
      setupTitle: 'Préparez les cartes',
      setupIntro: 'Choisissez le nombre de cartes, téléchargez le PDF et imprimez-le. Ensuite, tirez les numéros depuis cet écran.',
      gameTitle: 'Cartes',
      gameIntro: 'Tirez les numéros un par un. Les prix ne comptent que pour les cartes actives.',
      count: 'Nombre de cartes',
      countMinus: 'Une carte de moins',
      countPlus: 'Une carte de plus',
      countHint: max => `De 1 à ${max}.`,
      cardTheme: 'Thème des cartes',
      pdfOnly: 'Pour le PDF uniquement.',
      generate: 'Générer les cartes',
      download: 'Télécharger le PDF',
      preparing: 'Préparation des cartes…',
      generating: (done, total) => `Génération de ${done} cartes sur ${total}…`,
      generatingPdf: 'Préparation du PDF…',
      readyTitle: n => `${n} cartes prêtes.`,
      readyNote: 'Téléchargez le PDF et imprimez-le. Ensuite, tirez les numéros ici.',
      changeCount: 'Changer le nombre',
      setupNote: 'PDF A4 · 3 cartes par page. La génération peut prendre quelques secondes.',
      generateError: 'Impossible de générer le PDF. Réessayez.',
      generatedAnnounce: n => `${n} cartes générées. PDF téléchargé.`,
      themeClassico: 'Classique',
      themeNatale: 'Noël',
      themeCrema: 'Crème',
      themeBiancoNero: 'Noir et blanc',
      cardsTrigger: n => `Cartes · ${formatNumber(n)} active${n === 1 ? '' : 's'}`,
      latestPrizes: 'Prix de ce tirage',
      latestBefore: 'Les prix apparaissent après le premier tirage.',
      latestNoPrize: 'Aucun prix pour ce tirage.',
      noActive: 'Aucune carte active : les prix ne seront pas recherchés.',
      previousPrizes: 'Prix précédents',
      previousEmpty: 'Les tirages avec des prix apparaissent ici.',
      resetBody: 'Tous les numéros redeviennent disponibles et les prix sont remis à zéro. Les cartes restent les mêmes.',
      resetAnnounce: 'Partie remise à zéro. Les 90 numéros sont de nouveau disponibles.',
      cardsTitle: 'Cartes',
      cardsLede: "Désactivez les cartes que vous n'avez pas distribuées : les prix ne sont recherchés que parmi les cartes actives. Chaque prix revient aux premières cartes qui l'atteignent.",
      cardsSummary: (active, off) => `${formatNumber(active)} active${active === 1 ? '' : 's'} · ${formatNumber(off)} non distribuée${off === 1 ? '' : 's'}`,
      ranges: 'Plages',
      rangeHint: 'Par exemple 8-20, 27',
      disable: 'Désactiver',
      enable: 'Activer',
      rangeError: max => `Écrivez des numéros ou des plages de 1 à ${max}.`,
      cardsGridLabel: 'Choisissez les cartes actives',
      cardsLegend: 'Pleine : active. En pointillés : non distribuée.',
      cardChip: (n, active) => `Carte ${n}, ${active ? 'active' : 'non distribuée'}`,
      pages: 'Pages des cartes',
      pagePrev: 'Page précédente',
      pageNext: 'Page suivante',
      pageRange: (from, to, total) => `${from}–${to} sur ${total}`,
      redownload: 'Télécharger à nouveau le PDF',
      redownloadError: 'Impossible de télécharger le PDF. Réessayez.',
      newCards: 'Nouvelles cartes',
      newCardsTitle: 'Générer de nouvelles cartes ?',
      newCardsBody: 'La partie en cours et les cartes actuelles seront supprimées. Les cartes déjà imprimées ne seront plus valides.',
      newCardsConfirm: 'Générer de nouvelles cartes',
      tierAmbo: 'Paire',
      tierTerna: 'Trio',
      tierQuaterna: 'Quatuor',
      tierCinquina: 'Ligne',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} sur la carte ${cards[0]}.`
        : `${tier} sur les cartes ${joinList(cards, 'et')}.`,
      logMeta: (n, number) => `Tirage ${n} · ${number}`,
    },
  };

  const darkMedia = matchMedia('(prefers-color-scheme: dark)');
  let canPersist = storageAvailable();
  let systemLang = detectSystemLanguage();
  let prefs = loadPrefs();
  let resolvedLang = prefs.lang === 'system' ? systemLang : prefs.lang;
  let game = State.loadGame(readStored(STATE_KEY, null), DEFAULT_THEME);
  let selectedTheme = DEFAULT_THEME;
  let pendingPdf = null;
  let cardsPage = 0;
  let busy = false;

  const dom = {
    pageTitle: document.getElementById('page-title'),
    pageIntro: document.getElementById('page-intro'),
    pageTools: document.getElementById('page-tools'),
    progress: document.getElementById('progress'),
    progressFill: document.getElementById('progress-fill'),
    drawnCount: document.getElementById('drawn-count'),
    setupView: document.getElementById('setup-view'),
    setupForm: document.getElementById('setup-form'),
    setupFields: document.getElementById('setup-fields'),
    setupSubmit: document.getElementById('setup-submit'),
    setupProgress: document.getElementById('setup-progress'),
    setupProgressText: document.getElementById('setup-progress-text'),
    setupReady: document.getElementById('setup-ready'),
    setupReadyTitle: document.getElementById('setup-ready-title'),
    startButton: document.getElementById('start-button'),
    changeCount: document.getElementById('change-count'),
    cardCount: document.getElementById('card-count'),
    countMinus: document.getElementById('count-minus'),
    countPlus: document.getElementById('count-plus'),
    countHint: document.getElementById('count-hint'),
    themeChoices: document.getElementById('theme-choices'),
    downloadButton: document.getElementById('download-button'),
    setupError: document.getElementById('setup-error'),
    gameView: document.getElementById('game-view'),
    board: document.getElementById('board'),
    cardsButton: document.getElementById('open-cards'),
    cardsButtonLabel: document.getElementById('cards-button-label'),
    drawButton: document.getElementById('draw-button'),
    lastNumber: document.getElementById('last-number'),
    lastName: document.getElementById('last-name'),
    lastNumberSr: document.getElementById('last-number-sr'),
    stageStatus: document.getElementById('stage-status'),
    stageOrdinal: document.getElementById('stage-ordinal'),
    resetButton: document.getElementById('reset-button'),
    latestMeta: document.getElementById('latest-meta'),
    recentEmpty: document.getElementById('recent-empty'),
    recentList: document.getElementById('recent-list'),
    noActiveNotice: document.getElementById('no-active-notice'),
    latestEmpty: document.getElementById('latest-empty'),
    latestGroups: document.getElementById('latest-groups'),
    previousEmpty: document.getElementById('previous-empty'),
    previousList: document.getElementById('previous-list'),
    savedLabel: document.getElementById('saved-label'),
    settingsButton: document.getElementById('open-settings'),
    settingsDialog: document.getElementById('settings-dialog'),
    settingsLede: document.getElementById('settings-lede'),
    detectedLanguage: document.getElementById('detected-language'),
    namesInput: document.getElementById('neapolitan-names'),
    cardsDialog: document.getElementById('cards-dialog'),
    cardsSummary: document.getElementById('cards-summary'),
    rangeInput: document.getElementById('range-input'),
    rangeError: document.getElementById('range-error'),
    disableRange: document.getElementById('disable-range'),
    enableRange: document.getElementById('enable-range'),
    cardsGrid: document.getElementById('cards-grid'),
    cardsPager: document.getElementById('cards-pager'),
    cardsPageStatus: document.getElementById('cards-page'),
    cardsPrev: document.getElementById('cards-prev'),
    cardsNext: document.getElementById('cards-next'),
    cardsError: document.getElementById('cards-error'),
    redownloadButton: document.getElementById('redownload-button'),
    newCardsButton: document.getElementById('new-cards-button'),
    resetDialog: document.getElementById('reset-dialog'),
    newCardsDialog: document.getElementById('new-cards-dialog'),
    liveRegion: document.getElementById('live-region'),
    shortcut: document.querySelector('.shortcut'),
    languageInputs: [...document.querySelectorAll('input[name="language"]')],
    themeInputs: [...document.querySelectorAll('input[name="theme"]')],
  };

  const ui = globalThis.BingoBoardUi.create({
    board: dom.board,
    recentList: dom.recentList,
    recentEmpty: dom.recentEmpty,
    lastNumber: dom.lastNumber,
    lastName: dom.lastName,
    lastNumberSr: dom.lastNumberSr,
    stageOrdinal: dom.stageOrdinal,
    stageStatus: dom.stageStatus,
    drawnCount: dom.drawnCount,
    progress: dom.progress,
    progressFill: dom.progressFill,
    drawButton: dom.drawButton,
    resetButton: dom.resetButton,
    shortcut: dom.shortcut,
    total: TOTAL,
    names: neapolitanName,
    t,
  });

  init();

  function init() {
    ui.build();
    buildThemeChoices();
    dom.cardCount.min = String(Cards.MIN_CARDS);
    dom.cardCount.max = String(Cards.MAX_CARDS);
    setSetupState('form');
    syncControls(prefs, dom);
    applyTheme();
    bindEvents();
    applyLanguage();
    validateCount();
  }

  function t(key, ...args) {
    const value = COPY[resolvedLang][key];
    return typeof value === 'function' ? value(...args) : value;
  }

  function neapolitanName(number) {
    return prefs.names ? (NAMES[number - 1] || '') : '';
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(NUMBER_LOCALES[resolvedLang] || 'en-GB', { useGrouping: true }).format(value);
  }

  function setSetupState(state) {
    dom.setupFields.hidden = state !== 'form';
    dom.setupSubmit.hidden = state !== 'form';
    dom.setupProgress.hidden = state !== 'progress';
    dom.setupReady.hidden = state !== 'ready';
    dom.setupForm.setAttribute('aria-busy', String(state === 'progress'));
  }

  function renderReadyCopy() {
    if (!game) return;
    dom.setupReadyTitle.textContent = t('readyTitle', formatNumber(game.cards.length));
  }

  function buildThemeChoices() {
    const filled = new Set([0, 1, 3, 5, 7, 10, 11, 13, 15, 17, 18, 20, 21, 23, 25]);
    const fragment = document.createDocumentFragment();

    Pdf.THEME_IDS.forEach(id => {
      const theme = Pdf.THEMES[id];
      const label = document.createElement('label');
      label.className = 'choice theme-choice';

      const input = document.createElement('input');
      input.className = 'sr-only';
      input.type = 'radio';
      input.name = 'print-theme';
      input.value = id;
      input.checked = id === selectedTheme;

      const body = document.createElement('span');
      body.className = 'choice__body theme-choice__body';
      body.style.setProperty('--print-header', cssColor(theme.header));
      body.style.setProperty('--print-header-ink', cssColor(theme.headerInk));
      body.style.setProperty('--print-ink', cssColor(theme.numberInk));
      body.style.setProperty('--print-grid', cssColor(theme.grid));
      body.style.setProperty('--print-cell', cssColor(theme.cell));
      body.style.setProperty('--print-accent', cssColor(theme.accent));

      const preview = document.createElement('span');
      preview.className = 'theme-preview';
      preview.setAttribute('aria-hidden', 'true');
      const band = document.createElement('span');
      band.className = 'theme-preview__band';
      const grid = document.createElement('span');
      grid.className = 'theme-preview__grid';
      for (let cell = 0; cell < 27; cell += 1) {
        const mini = document.createElement('span');
        mini.className = 'theme-preview__cell';
        if (filled.has(cell)) mini.classList.add('is-filled');
        grid.appendChild(mini);
      }
      preview.append(band, grid);

      const text = document.createElement('span');
      text.className = 'choice__label';
      text.dataset.i18n = theme.labelKey;
      text.textContent = t(theme.labelKey);

      const mark = document.createElement('span');
      mark.className = 'choice__mark';
      mark.setAttribute('aria-hidden', 'true');

      body.append(preview, text, mark);
      label.append(input, body);
      fragment.appendChild(label);
    });

    dom.themeChoices.replaceChildren(fragment);
  }

  function cssColor(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  function render({ animateDraw = false, animatePrizes = false } = {}) {
    const showSetup = !game || Boolean(pendingPdf);
    dom.setupView.hidden = !showSetup;
    dom.gameView.hidden = showSetup;
    dom.pageTools.hidden = showSetup;
    dom.progress.hidden = showSetup;
    dom.pageTitle.textContent = t(showSetup ? 'setupTitle' : 'gameTitle');
    dom.pageIntro.textContent = t(showSetup ? 'setupIntro' : 'gameIntro');
    dom.shortcut.hidden = showSetup;

    if (showSetup) {
      if (pendingPdf) renderReadyCopy();
      return;
    }

    ui.renderDrawn(game.drawn, animateDraw);
    ui.renderTally(game.drawn);
    ui.renderStage(game.drawn, animateDraw);
    dom.cardsButtonLabel.textContent = t('cardsTrigger', game.cards.length - game.disabled.length);
    updateLatestPrizes(animatePrizes);
    updatePreviousPrizes();
    applyPersistenceCopy();
  }

  function updateLatestPrizes(animate) {
    const latest = game.drawn.length ? game.drawn[game.drawn.length - 1] : null;
    const active = game.cards.length - game.disabled.length;

    dom.noActiveNotice.hidden = active > 0;
    dom.latestGroups.replaceChildren();
    dom.latestGroups.hidden = true;
    dom.latestMeta.hidden = latest === null;
    dom.latestMeta.textContent = latest === null ? '' : t('drawOrdinal', game.drawn.length);

    if (latest === null) {
      dom.latestEmpty.hidden = false;
      dom.latestEmpty.textContent = t('latestBefore');
      return;
    }

    const entry = game.log.find(item => item.number === latest);
    if (!entry) {
      dom.latestEmpty.hidden = false;
      dom.latestEmpty.textContent = t('latestNoPrize');
      return;
    }

    dom.latestEmpty.hidden = true;
    dom.latestGroups.hidden = false;
    for (const group of groupAwards(entry.awards)) {
      const box = document.createElement('div');
      box.className = `prize-group${group.tier === 'bingo' ? ' prize-group--bingo' : ''}${animate ? ' is-new' : ''}`;

      const tier = document.createElement('p');
      tier.className = 'prize-tier';
      tier.textContent = tierLabel(group.tier);

      const cards = document.createElement('p');
      cards.className = 'prize-cards';
      cards.textContent = group.cards.join(' · ');

      box.append(tier, cards);
      dom.latestGroups.appendChild(box);
    }
  }

  function updatePreviousPrizes() {
    const latest = game.drawn.length ? game.drawn[game.drawn.length - 1] : null;
    const entries = game.log.filter(entry => entry.number !== latest).slice().reverse();
    dom.previousEmpty.hidden = entries.length > 0;
    dom.previousList.hidden = entries.length === 0;
    dom.previousList.replaceChildren();

    for (const entry of entries) {
      const item = document.createElement('li');
      item.className = 'prize-log__entry';

      const meta = document.createElement('p');
      meta.className = 'prize-log__meta';
      meta.textContent = t('logMeta', game.drawn.indexOf(entry.number) + 1, entry.number);

      const awards = document.createElement('p');
      awards.className = 'prize-log__awards';
      awards.textContent = groupAwards(entry.awards)
        .map(group => `${tierLabel(group.tier)} ${group.cards.join(', ')}`)
        .join(' · ');

      item.append(meta, awards);
      dom.previousList.appendChild(item);
    }
  }

  function groupAwards(awards) {
    return Prizes.TIER_ORDER
      .map(tier => {
        const cards = awards
          .filter(award => award.tier === tier)
          .map(award => award.card)
          .sort((a, b) => a - b);
        return cards.length ? { tier, cards } : null;
      })
      .filter(Boolean);
  }

  function tierLabel(tier) {
    return t(`tier${tier.charAt(0).toUpperCase()}${tier.slice(1)}`);
  }

  function drawNumber() {
    if (!game || game.drawn.length >= TOTAL) return;

    const remaining = [];
    for (let n = 1; n <= TOTAL; n += 1) {
      if (!game.drawn.includes(n)) remaining.push(n);
    }

    const number = remaining[randomIndex(remaining.length)];
    const result = State.draw(game, number);
    game = result.game;

    persistGame();
    render({ animateDraw: true, animatePrizes: true });

    let message = t('drawAnnounce', number, TOTAL - game.drawn.length, neapolitanName(number));
    for (const group of groupAwards(result.awards)) {
      message += ` ${t('prizeLine', tierLabel(group.tier), group.cards)}`;
    }
    announce(message);
  }

  function resetGame() {
    if (!game) return;
    game = State.reset(game);
    persistGame();
    render();
    announce(t('resetAnnounce'));
  }

  async function generateCards(event) {
    event.preventDefault();
    if (busy) return;
    const count = readCount();
    if (count === null) {
      validateCount();
      return;
    }

    clearSetupError();
    busy = true;
    dom.setupProgressText.textContent = t('preparing');
    setSetupState('progress');

    try {
      const cards = await Cards.generateAsync(count, {
        onProgress: (done, total) => {
          dom.setupProgressText.textContent = t('generating', formatNumber(done), formatNumber(total));
        },
      });

      dom.setupProgressText.textContent = t('generatingPdf');
      await new Promise(resolve => setTimeout(resolve, 0));

      const pdf = Pdf.buildPdf({ cards, theme: selectedTheme, lang: resolvedLang });
      pendingPdf = {
        blob: new Blob([pdf], { type: 'application/pdf' }),
        filename: Pdf.pdfFilename(count),
      };
      game = State.createGame(cards, selectedTheme);
      persistGame();
      cardsPage = 0;
      renderReadyCopy();
      setSetupState('ready');
      dom.startButton.focus();
    } catch (error) {
      game = null;
      pendingPdf = null;
      setSetupState('form');
      showSetupError(t('generateError'));
    } finally {
      busy = false;
      validateCount();
    }
  }

  function startGame() {
    if (!pendingPdf || !game) return;
    try {
      downloadBlob(pendingPdf.blob, pendingPdf.filename);
    } catch (error) {
      showSetupError(t('redownloadError'));
      return;
    }

    pendingPdf = null;
    render();
    announce(t('generatedAnnounce', formatNumber(game.cards.length)));
    dom.drawButton.focus();
  }

  function changeCount() {
    pendingPdf = null;
    game = null;
    clearStoredGame();
    clearSetupError();
    setSetupState('form');
    render();
    validateCount();
    dom.cardCount.focus();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function redownloadPdf() {
    if (!game) return;
    dom.cardsError.hidden = true;
    dom.redownloadButton.disabled = true;
    try {
      const pdf = Pdf.buildPdf({ cards: game.cards, theme: game.printTheme, lang: resolvedLang });
      downloadBlob(new Blob([pdf], { type: 'application/pdf' }), Pdf.pdfFilename(game.cards.length));
    } catch (error) {
      dom.cardsError.textContent = t('redownloadError');
      dom.cardsError.hidden = false;
    } finally {
      dom.redownloadButton.disabled = false;
    }
  }

  function openCardsDialog() {
    if (!game) return;
    dom.cardsError.hidden = true;
    hideRangeError();
    renderCardsDrawer();
    openDialog(dom.cardsDialog);
  }

  function renderCardsDrawer() {
    if (!game) return;
    const off = new Set(game.disabled);
    const active = game.cards.length - off.size;
    dom.cardsSummary.textContent = t('cardsSummary', active, off.size);

    const pages = Math.max(1, Math.ceil(game.cards.length / PAGE_SIZE));
    if (cardsPage >= pages) cardsPage = pages - 1;
    const start = cardsPage * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, game.cards.length);

    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      const number = index + 1;
      const isActive = !off.has(number);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-chip';
      button.dataset.card = String(number);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', t('cardChip', number, isActive));
      button.textContent = String(number);
      fragment.appendChild(button);
    }
    dom.cardsGrid.replaceChildren(fragment);

    dom.cardsPager.hidden = pages <= 1;
    dom.cardsPageStatus.textContent = t(
      'pageRange',
      formatNumber(start + 1),
      formatNumber(end),
      formatNumber(game.cards.length)
    );
    dom.cardsPrev.disabled = cardsPage === 0;
    dom.cardsNext.disabled = cardsPage === pages - 1;
  }

  function changePage(delta) {
    if (!game) return;
    const pages = Math.max(1, Math.ceil(game.cards.length / PAGE_SIZE));
    const next = Math.min(pages - 1, Math.max(0, cardsPage + delta));
    if (next === cardsPage) return;
    cardsPage = next;
    renderCardsDrawer();
    const first = dom.cardsGrid.querySelector('.card-chip');
    if (first) first.focus();
  }

  function toggleCard(number) {
    if (!game) return;
    game = State.toggleCard(game, number);
    persistGame();
    render();
    renderCardsDrawer();
    const chip = dom.cardsGrid.querySelector(`[data-card="${number}"]`);
    if (chip) chip.focus();
  }

  function applyRange(mode) {
    if (!game) return;
    const { game: next, changed, numbers } = State.applyRange(game, mode, dom.rangeInput.value);
    if (!numbers.length) {
      showRangeError(t('rangeError', formatNumber(game.cards.length)));
      return;
    }

    if (changed) {
      game = next;
      persistGame();
      render();
      renderCardsDrawer();
    }

    dom.rangeInput.value = '';
    hideRangeError();
    (mode === 'disable' ? dom.disableRange : dom.enableRange).focus();
  }

  function showRangeError(message) {
    dom.rangeError.textContent = message;
    dom.rangeError.hidden = false;
  }

  function hideRangeError() {
    dom.rangeError.hidden = true;
    dom.rangeError.textContent = '';
  }

  function confirmNewCards() {
    game = null;
    pendingPdf = null;
    cardsPage = 0;
    selectedTheme = DEFAULT_THEME;
    clearStoredGame();
    if (dom.cardsDialog.open) closeDialog(dom.cardsDialog);
    dom.cardCount.value = String(DEFAULT_COUNT);
    dom.themeChoices.querySelectorAll('input[name="print-theme"]').forEach(input => {
      input.checked = input.value === selectedTheme;
    });
    clearSetupError();
    hideRangeError();
    dom.cardsError.hidden = true;
    setSetupState('form');
    render();
    validateCount();
    dom.cardCount.focus();
  }

  function validateCount() {
    const valid = readCount() !== null;
    dom.downloadButton.disabled = !valid;
    dom.countHint.hidden = valid;
    dom.cardCount.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  function readCount() {
    const raw = dom.cardCount.value.trim();
    if (raw === '') return null;
    const value = Number(raw);
    return Number.isInteger(value) && value >= Cards.MIN_CARDS && value <= Cards.MAX_CARDS ? value : null;
  }

  function clampCount() {
    if (dom.cardCount.value.trim() === '') return;
    const value = Number(dom.cardCount.value);
    if (!Number.isFinite(value)) return;
    dom.cardCount.value = String(Math.min(Cards.MAX_CARDS, Math.max(Cards.MIN_CARDS, Math.round(value))));
    validateCount();
  }

  function stepCount(delta) {
    const current = readCount() ?? DEFAULT_COUNT;
    dom.cardCount.value = String(Math.min(Cards.MAX_CARDS, Math.max(Cards.MIN_CARDS, current + delta)));
    clearSetupError();
    validateCount();
  }

  function clearSetupError() {
    dom.setupError.hidden = true;
    dom.setupError.textContent = '';
  }

  function showSetupError(message) {
    dom.setupError.textContent = message;
    dom.setupError.hidden = false;
  }

  function applyTheme() {
    applyThemeToDocument(prefs, darkMedia);
  }

  function applyLanguage() {
    resolvedLang = applyLanguageToPage({
      prefs,
      systemLang,
      copy: COPY,
      detectedLanguage: dom.detectedLanguage,
    });
    dom.countHint.textContent = t('countHint', formatNumber(Cards.MAX_CARDS));
    render();
    applyPersistenceCopy();
  }

  function applyPersistenceCopy() {
    if (!dom.savedLabel || !dom.settingsLede) return;
    dom.savedLabel.textContent = canPersist ? t('saved') : t('notSaved');
    dom.settingsLede.textContent = canPersist ? t('settingsLede') : t('settingsLedePlain');
  }

  function announce(message) {
    dom.liveRegion.textContent = message;
  }

  function bindEvents() {
    dom.setupForm.addEventListener('submit', generateCards);
    dom.startButton.addEventListener('click', startGame);
    dom.changeCount.addEventListener('click', changeCount);
    dom.cardCount.addEventListener('input', () => {
      clearSetupError();
      validateCount();
    });
    dom.cardCount.addEventListener('blur', clampCount);
    dom.countMinus.addEventListener('click', () => stepCount(-1));
    dom.countPlus.addEventListener('click', () => stepCount(1));
    dom.themeChoices.addEventListener('change', event => {
      const input = event.target.closest('input[name="print-theme"]');
      if (!input || !input.checked) return;
      selectedTheme = input.value;
      clearSetupError();
    });

    dom.drawButton.addEventListener('click', drawNumber);
    dom.resetButton.addEventListener('click', openResetDialog);
    dom.cardsButton.addEventListener('click', openCardsDialog);
    dom.settingsButton.addEventListener('click', openSettingsDialog);

    dom.settingsDialog.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => closeDialog(dom.settingsDialog));
    });
    dom.settingsDialog.addEventListener('click', event => {
      if (event.target === dom.settingsDialog) closeDialog(dom.settingsDialog);
    });
    dom.settingsDialog.addEventListener('close', () => {
      syncModalLock();
      dom.settingsButton.focus();
    });

    dom.cardsDialog.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => closeDialog(dom.cardsDialog));
    });
    dom.cardsDialog.addEventListener('click', event => {
      if (event.target === dom.cardsDialog) closeDialog(dom.cardsDialog);
    });
    dom.cardsDialog.addEventListener('close', () => {
      syncModalLock();
      (game ? dom.cardsButton : dom.cardCount).focus();
    });

    dom.resetDialog.addEventListener('click', event => {
      if (event.target === dom.resetDialog) closeDialog(dom.resetDialog, 'cancel');
    });
    dom.resetDialog.addEventListener('close', () => {
      syncModalLock();
      handleResetClose();
    });

    dom.newCardsDialog.addEventListener('click', event => {
      if (event.target === dom.newCardsDialog) closeDialog(dom.newCardsDialog, 'cancel');
    });
    dom.newCardsDialog.addEventListener('close', () => {
      syncModalLock();
      if (dom.newCardsDialog.returnValue === 'confirm') {
        confirmNewCards();
      } else if (game) {
        dom.newCardsButton.focus();
      }
    });

    bindSettings(prefs, dom, {
      persistPrefs,
      onChange: key => {
        if (key === 'lang') applyLanguage();
        else if (key === 'theme') applyTheme();
        else render();
      },
    });

    dom.cardsGrid.addEventListener('click', event => {
      const button = event.target.closest('button[data-card]');
      if (!button) return;
      toggleCard(Number(button.dataset.card));
    });
    dom.cardsPrev.addEventListener('click', () => changePage(-1));
    dom.cardsNext.addEventListener('click', () => changePage(1));
    dom.rangeInput.addEventListener('input', hideRangeError);
    dom.disableRange.addEventListener('click', () => applyRange('disable'));
    dom.enableRange.addEventListener('click', () => applyRange('enable'));
    dom.redownloadButton.addEventListener('click', redownloadPdf);
    dom.newCardsButton.addEventListener('click', openNewCardsDialog);

    bindShortcut({
      drawButton: dom.drawButton,
      canDraw: () => Boolean(game) && !pendingPdf,
      draw: drawNumber,
    });

    darkMedia.addEventListener('change', () => {
      if (prefs.theme === 'system') applyTheme();
    });
    window.addEventListener('languagechange', () => {
      systemLang = detectSystemLanguage();
      dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
      if (prefs.lang === 'system') applyLanguage();
    });
  }

  function openSettingsDialog() {
    syncControls(prefs, dom);
    openDialog(dom.settingsDialog);
  }

  function openResetDialog() {
    dom.resetDialog.returnValue = '';
    openDialog(dom.resetDialog);
  }

  function openNewCardsDialog() {
    dom.newCardsDialog.returnValue = '';
    openDialog(dom.newCardsDialog);
  }

  function handleResetClose() {
    if (dom.resetDialog.returnValue === 'confirm') {
      resetGame();
      dom.drawButton.focus();
    } else if (game) {
      dom.resetButton.focus();
    }
  }

  function persistGame() {
    if (!game || !canPersist) return;
    try {
      writeStored(STATE_KEY, game);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function clearStoredGame() {
    if (!canPersist) return;
    try {
      removeStored(STATE_KEY);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function persistPrefs() {
    if (!canPersist) return;
    try {
      writeStored(PREFS_KEY, prefs);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }
})();
