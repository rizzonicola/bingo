(() => {
  'use strict';

  const TOTAL = 90;
  // The main board keeps its own key; the card game is a separate game.
  const STATE_KEY = 'bingo.cards.v1';
  const PREFS_KEY = 'tombola.prefs.v1';
  const LANGUAGES = ['it', 'en', 'fr'];
  const THEMES = ['system', 'light', 'dark', 'christmas', 'christmas-light', 'christmas-red'];
  const THEME_COLORS = {
    light: '#e8ece7',
    dark: '#121617',
    christmas: '#0c1711',
    'christmas-light': '#f1e8d8',
    'christmas-red': '#1b0c0d',
  };
  const LANGUAGE_NAMES = { it: 'Italiano', en: 'English', fr: 'Français' };
  const DEFAULT_COUNT = 12;
  const DEFAULT_THEME = 'classico';

  const NAMES = globalThis.BINGO_NAMES || [];
  const Cards = globalThis.BingoCards;
  const Prizes = globalThis.BingoPrizes;
  const Pdf = globalThis.BingoPdf;

  function joinList(values, word) {
    const list = values.map(String);
    if (list.length < 2) return list[0] || '';
    if (list.length === 2) return `${list[0]} ${word} ${list[1]}`;
    return `${list.slice(0, -1).join(', ')} ${word} ${list[list.length - 1]}`;
  }

  const COPY = {
    it: {
      docTitle: 'Cartelle · Bingo',
      docDescription: 'Genera e stampa le cartelle del bingo, poi chiama i numeri e segui i premi. Le cartelle non distribuite restano fuori dal gioco.',
      ogTitle: 'Cartelle · Bingo',
      ogDescription: 'Genera le cartelle, scarica il PDF e segui i premi mentre chiami i numeri.',
      skip: 'Vai alle cartelle',
      settings: 'Impostazioni',
      board: 'Tabellone',
      boardLink: 'Torna al tabellone',
      setupTitle: 'Prepara le cartelle',
      setupIntro: 'Scegli quante cartelle servono, scarica il PDF e stampalo. Poi chiama i numeri da questa schermata.',
      gameTitle: 'Cartelle',
      gameIntro: 'Chiama i numeri uno alla volta. I premi valgono solo per le cartelle attive.',
      count: 'Numero di cartelle',
      countMinus: 'Una cartella in meno',
      countPlus: 'Una cartella in più',
      countHint: 'Da 1 a 100.',
      cardTheme: 'Tema delle cartelle',
      pdfOnly: 'Solo per il PDF.',
      download: 'Scarica il PDF',
      setupNote: 'PDF A4 · 3 cartelle per pagina. Il PDF si scarica subito; poi si gioca da qui.',
      generateError: 'Non è stato possibile generare il PDF. Riprova.',
      generatedAnnounce: n => `${n} cartelle generate. PDF scaricato.`,
      themeClassico: 'Classico',
      themeNatale: 'Natale',
      themeCrema: 'Crema',
      themeBiancoNero: 'Bianco e nero',
      drawnLabel: 'estratti',
      progressLabel: 'Numeri estratti',
      lastDraw: 'Ultima estrazione',
      noDraw: 'Nessun numero estratto.',
      draw: 'Estrai un numero',
      boardTitle: 'Numeri da 1 a 90',
      boardLabel: 'Tabellone dei numeri da 1 a 90',
      cardsTrigger: n => `Cartelle · ${n} attive`,
      latestPrizes: 'Premi di questa estrazione',
      latestBefore: 'I premi compaiono dopo la prima estrazione.',
      latestNoPrize: 'Nessun premio a questa estrazione.',
      noActive: 'Nessuna cartella attiva: i premi non verranno cercati.',
      previousPrizes: 'Premi precedenti',
      previousEmpty: 'Le estrazioni con premi compaiono qui.',
      restart: 'Ricomincia',
      saved: 'Salvato su questo dispositivo.',
      notSaved: 'La partita non viene salvata su questo dispositivo.',
      resetTitle: 'Ricominciare da capo?',
      resetBody: 'Tutti i numeri tornano disponibili e i premi si azzerano. Le cartelle restano le stesse.',
      resetAnnounce: 'Partita azzerata. I 90 numeri sono di nuovo disponibili.',
      cardsTitle: 'Cartelle',
      cardsLede: 'Disattiva le cartelle che non hai distribuito: i premi vengono cercati solo tra quelle attive.',
      cardsSummary: (active, off) => `${active} attive · ${off} non distribuite`,
      ranges: 'Intervalli',
      rangeHint: 'Per esempio 8-20, 27',
      disable: 'Disattiva',
      enable: 'Riattiva',
      rangeError: max => `Scrivi numeri o intervalli tra 1 e ${max}.`,
      cardsGridLabel: 'Scegli le cartelle attive',
      cardsLegend: 'Piena: attiva. Tratteggiata: non distribuita.',
      cardChip: (n, active) => `Cartella ${n}, ${active ? 'attiva' : 'non distribuita'}`,
      redownload: 'Scarica di nuovo il PDF',
      redownloadError: 'Non è stato possibile scaricare il PDF. Riprova.',
      newCards: 'Nuove cartelle',
      newCardsTitle: 'Generare nuove cartelle?',
      newCardsBody: 'La partita in corso e le cartelle attuali vengono eliminate. Le cartelle già stampate non saranno più valide.',
      newCardsConfirm: 'Genera nuove cartelle',
      done: 'Fatto',
      close: 'Chiudi',
      cancel: 'Annulla',
      tierAmbo: 'Ambo',
      tierTerna: 'Terna',
      tierQuaterna: 'Quaterna',
      tierCinquina: 'Cinquina',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} sulla cartella ${cards[0]}.`
        : `${tier} sulle cartelle ${joinList(cards, 'e')}.`,
      logMeta: (n, number) => `${n}ª · ${number}`,
      drawOrdinal: n => `${n}ª estrazione`,
      remaining: n => n === 1 ? 'Resta 1 numero.' : `Restano ${n} numeri.`,
      allDrawn: 'Tutti i 90 numeri sono usciti.',
      lastNumberSr: (n, name) => name
        ? `Ultimo numero estratto: ${n}, ${name}.`
        : `Ultimo numero estratto: ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Estratto il numero ${n}${name ? `: ${name}` : ''}.`;
        return rest === 0
          ? `${called} Tutti i 90 numeri sono usciti.`
          : `${called} ${rest === 1 ? 'Resta 1 numero.' : `Restano ${rest} numeri.`}`;
      },
      numberWord: 'Numero',
      drawnCell: 'estratto',
      pendingCell: 'non estratto',
      settingsLede: 'La lingua, i nomi e il colore si cambiano quando vuoi. Le modifiche restano su questo dispositivo.',
      settingsLedePlain: 'La lingua, i nomi e il colore si cambiano quando vuoi.',
      language: 'Lingua',
      system: 'Sistema',
      color: 'Colore',
      light: 'Chiaro',
      dark: 'Scuro',
      christmas: 'Natale',
      christmasLight: 'Crema',
      christmasRed: 'Rosso',
      names: 'Nomi napoletani',
      namesToggle: 'Mostra il nome tradizionale',
      namesHint: 'Sotto il numero compare il nome tradizionale napoletano.',
      numbers: 'Numeri da 1 a 90',
      shortcut: 'per estrarre',
      spaceKey: 'Spazio',
    },
    en: {
      docTitle: 'Cards · Bingo',
      docDescription: 'Generate and print bingo cards, then call the numbers and follow the prizes. Cards that were not handed out stay out of the game.',
      ogTitle: 'Cards · Bingo',
      ogDescription: 'Generate the cards, download the PDF, and follow the prizes as you call the numbers.',
      skip: 'Skip to the cards',
      settings: 'Settings',
      board: 'Board',
      boardLink: 'Back to the board',
      setupTitle: 'Prepare the cards',
      setupIntro: 'Choose how many cards you need, download the PDF, and print it. Then call the numbers from this screen.',
      gameTitle: 'Cards',
      gameIntro: 'Call the numbers one at a time. Prizes count only for active cards.',
      count: 'Number of cards',
      countMinus: 'One card less',
      countPlus: 'One more card',
      countHint: 'From 1 to 100.',
      cardTheme: 'Card theme',
      pdfOnly: 'For the PDF only.',
      download: 'Download PDF',
      setupNote: 'A4 PDF · 3 cards per page. The PDF downloads right away; then you play from here.',
      generateError: 'Could not generate the PDF. Try again.',
      generatedAnnounce: n => `${n} cards generated. PDF downloaded.`,
      themeClassico: 'Classic',
      themeNatale: 'Christmas',
      themeCrema: 'Cream',
      themeBiancoNero: 'Black and white',
      drawnLabel: 'drawn',
      progressLabel: 'Numbers drawn',
      lastDraw: 'Latest draw',
      noDraw: 'No numbers drawn yet.',
      draw: 'Draw a number',
      boardTitle: 'Numbers 1 to 90',
      boardLabel: 'Board of numbers 1 to 90',
      cardsTrigger: n => `Cards · ${n} active`,
      latestPrizes: 'Prizes on this draw',
      latestBefore: 'Prizes appear after the first draw.',
      latestNoPrize: 'No prizes on this draw.',
      noActive: 'No active cards: prizes will not be checked.',
      previousPrizes: 'Previous prizes',
      previousEmpty: 'Draws with prizes appear here.',
      restart: 'Start over',
      saved: 'Saved on this device.',
      notSaved: 'This game is not being saved on this device.',
      resetTitle: 'Start over?',
      resetBody: 'Every number becomes available again and the prizes are cleared. The cards stay the same.',
      resetAnnounce: 'Game cleared. All 90 numbers are available again.',
      cardsTitle: 'Cards',
      cardsLede: 'Disable the cards you did not hand out: prizes are checked only on active cards.',
      cardsSummary: (active, off) => `${active} active · ${off} not distributed`,
      ranges: 'Ranges',
      rangeHint: 'For example 8-20, 27',
      disable: 'Disable',
      enable: 'Enable',
      rangeError: max => `Write numbers or ranges from 1 to ${max}.`,
      cardsGridLabel: 'Choose the active cards',
      cardsLegend: 'Solid: active. Dashed: not distributed.',
      cardChip: (n, active) => `Card ${n}, ${active ? 'active' : 'not distributed'}`,
      redownload: 'Download the PDF again',
      redownloadError: 'Could not download the PDF. Try again.',
      newCards: 'New cards',
      newCardsTitle: 'Generate new cards?',
      newCardsBody: 'The current game and the current cards will be deleted. Cards already printed will no longer be valid.',
      newCardsConfirm: 'Generate new cards',
      done: 'Done',
      close: 'Close',
      cancel: 'Cancel',
      tierAmbo: 'Pair',
      tierTerna: 'Trio',
      tierQuaterna: 'Quartet',
      tierCinquina: 'Line',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} on card ${cards[0]}.`
        : `${tier} on cards ${joinList(cards, 'and')}.`,
      logMeta: (n, number) => `Draw ${n} · ${number}`,
      drawOrdinal: n => `Draw ${n}`,
      remaining: n => n === 1 ? '1 number left.' : `${n} numbers left.`,
      allDrawn: 'All 90 numbers are out.',
      lastNumberSr: (n, name) => name
        ? `Last number drawn: ${n}, ${name}.`
        : `Last number drawn: ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Number ${n} drawn${name ? `: ${name}` : ''}.`;
        return rest === 0
          ? `${called} All 90 numbers are out.`
          : `${called} ${rest === 1 ? '1 number left.' : `${rest} numbers left.`}`;
      },
      numberWord: 'Number',
      drawnCell: 'drawn',
      pendingCell: 'not drawn',
      settingsLede: 'Change the language, the names, and the color whenever you like. Your choices stay on this device.',
      settingsLedePlain: 'Change the language, the names, and the color whenever you like.',
      language: 'Language',
      system: 'System',
      color: 'Color',
      light: 'Light',
      dark: 'Dark',
      christmas: 'Christmas',
      christmasLight: 'Cream',
      christmasRed: 'Red',
      names: 'Neapolitan names',
      namesToggle: 'Show the traditional name',
      namesHint: 'The traditional Neapolitan name appears under each number.',
      numbers: 'Numbers 1 to 90',
      shortcut: 'to draw',
      spaceKey: 'Space',
    },
    fr: {
      docTitle: 'Cartes · Bingo',
      docDescription: 'Générez et imprimez les cartes du bingo, puis tirez les numéros et suivez les prix. Les cartes non distribuées restent hors du jeu.',
      ogTitle: 'Cartes · Bingo',
      ogDescription: 'Générez les cartes, téléchargez le PDF et suivez les prix pendant que vous tirez les numéros.',
      skip: 'Aller aux cartes',
      settings: 'Réglages',
      board: 'Tableau',
      boardLink: 'Retour au tableau',
      setupTitle: 'Préparez les cartes',
      setupIntro: 'Choisissez le nombre de cartes, téléchargez le PDF et imprimez-le. Ensuite, tirez les numéros depuis cet écran.',
      gameTitle: 'Cartes',
      gameIntro: 'Tirez les numéros un par un. Les prix ne comptent que pour les cartes actives.',
      count: 'Nombre de cartes',
      countMinus: 'Une carte de moins',
      countPlus: 'Une carte de plus',
      countHint: 'De 1 à 100.',
      cardTheme: 'Thème des cartes',
      pdfOnly: 'Pour le PDF uniquement.',
      download: 'Télécharger le PDF',
      setupNote: 'PDF A4 · 3 cartes par page. Le PDF se télécharge tout de suite ; ensuite, on joue ici.',
      generateError: 'Impossible de générer le PDF. Réessayez.',
      generatedAnnounce: n => `${n} cartes générées. PDF téléchargé.`,
      themeClassico: 'Classique',
      themeNatale: 'Noël',
      themeCrema: 'Crème',
      themeBiancoNero: 'Noir et blanc',
      drawnLabel: 'tirés',
      progressLabel: 'Numéros tirés',
      lastDraw: 'Dernier tirage',
      noDraw: 'Aucun numéro tiré.',
      draw: 'Tirer un numéro',
      boardTitle: 'Numéros de 1 à 90',
      boardLabel: 'Tableau des numéros de 1 à 90',
      cardsTrigger: n => `Cartes · ${n} actives`,
      latestPrizes: 'Prix de ce tirage',
      latestBefore: 'Les prix apparaissent après le premier tirage.',
      latestNoPrize: 'Aucun prix pour ce tirage.',
      noActive: 'Aucune carte active : les prix ne seront pas recherchés.',
      previousPrizes: 'Prix précédents',
      previousEmpty: 'Les tirages avec des prix apparaissent ici.',
      restart: 'Recommencer',
      saved: 'Enregistré sur cet appareil.',
      notSaved: "La partie n'est pas enregistrée sur cet appareil.",
      resetTitle: 'Recommencer à zéro ?',
      resetBody: 'Tous les numéros redeviennent disponibles et les prix sont remis à zéro. Les cartes restent les mêmes.',
      resetAnnounce: 'Partie remise à zéro. Les 90 numéros sont de nouveau disponibles.',
      cardsTitle: 'Cartes',
      cardsLede: "Désactivez les cartes que vous n'avez pas distribuées : les prix ne sont recherchés que parmi les cartes actives.",
      cardsSummary: (active, off) => `${active} actives · ${off} non distribuées`,
      ranges: 'Plages',
      rangeHint: 'Par exemple 8-20, 27',
      disable: 'Désactiver',
      enable: 'Activer',
      rangeError: max => `Écrivez des numéros ou des plages de 1 à ${max}.`,
      cardsGridLabel: 'Choisissez les cartes actives',
      cardsLegend: 'Pleine : active. En pointillés : non distribuée.',
      cardChip: (n, active) => `Carte ${n}, ${active ? 'active' : 'non distribuée'}`,
      redownload: 'Télécharger à nouveau le PDF',
      redownloadError: 'Impossible de télécharger le PDF. Réessayez.',
      newCards: 'Nouvelles cartes',
      newCardsTitle: 'Générer de nouvelles cartes ?',
      newCardsBody: 'La partie en cours et les cartes actuelles seront supprimées. Les cartes déjà imprimées ne seront plus valides.',
      newCardsConfirm: 'Générer de nouvelles cartes',
      done: 'Terminé',
      close: 'Fermer',
      cancel: 'Annuler',
      tierAmbo: 'Paire',
      tierTerna: 'Trio',
      tierQuaterna: 'Quatuor',
      tierCinquina: 'Ligne',
      tierBingo: 'Bingo',
      prizeLine: (tier, cards) => cards.length === 1
        ? `${tier} sur la carte ${cards[0]}.`
        : `${tier} sur les cartes ${joinList(cards, 'et')}.`,
      logMeta: (n, number) => `Tirage ${n} · ${number}`,
      drawOrdinal: n => `Tirage ${n}`,
      remaining: n => n === 1 ? '1 numéro restant.' : `${n} numéros restants.`,
      allDrawn: 'Les 90 numéros sont sortis.',
      lastNumberSr: (n, name) => name
        ? `Dernier numéro tiré : ${n}, ${name}.`
        : `Dernier numéro tiré : ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Numéro ${n} tiré${name ? ` : ${name}` : ''}.`;
        return rest === 0
          ? `${called} Les 90 numéros sont sortis.`
          : `${called} ${rest === 1 ? '1 numéro restant.' : `${rest} numéros restants.`}`;
      },
      numberWord: 'Numéro',
      drawnCell: 'tiré',
      pendingCell: 'pas tiré',
      settingsLede: 'Changez la langue, les noms et la couleur quand vous voulez. Vos choix restent sur cet appareil.',
      settingsLedePlain: 'Changez la langue, les noms et la couleur quand vous voulez.',
      language: 'Langue',
      system: 'Système',
      color: 'Couleur',
      light: 'Clair',
      dark: 'Sombre',
      christmas: 'Noël',
      christmasLight: 'Crème',
      christmasRed: 'Rouge',
      names: 'Noms napolitains',
      namesToggle: 'Afficher le nom traditionnel',
      namesHint: 'Le nom traditionnel napolitain apparaît sous chaque numéro.',
      numbers: 'Numéros de 1 à 90',
      shortcut: 'pour tirer',
      spaceKey: 'Espace',
    },
  };

  const html = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const darkMedia = matchMedia('(prefers-color-scheme: dark)');
  const cells = new Map();

  let canPersist = storageAvailable();
  let systemLang = detectSystemLanguage();
  let prefs = loadPrefs();
  let resolvedLang = prefs.lang === 'system' ? systemLang : prefs.lang;
  let game = loadGame();
  let selectedTheme = DEFAULT_THEME;

  const dom = {
    pageTitle: document.getElementById('page-title'),
    pageIntro: document.getElementById('page-intro'),
    pageTools: document.getElementById('page-tools'),
    progress: document.getElementById('progress'),
    progressFill: document.getElementById('progress-fill'),
    drawnCount: document.getElementById('drawn-count'),
    setupView: document.getElementById('setup-view'),
    setupForm: document.getElementById('setup-form'),
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

  init();

  function init() {
    buildBoard();
    buildThemeChoices();
    syncControls();
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

  function buildBoard() {
    const fragment = document.createDocumentFragment();
    for (let n = 1; n <= TOTAL; n += 1) {
      const cell = document.createElement('li');
      cell.className = 'cell';
      cell.dataset.number = String(n);
      cell.textContent = String(n).padStart(2, '0');
      cells.set(n, cell);
      fragment.appendChild(cell);
    }
    dom.board.replaceChildren(fragment);
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
    const hasGame = Boolean(game);
    dom.setupView.hidden = hasGame;
    dom.gameView.hidden = !hasGame;
    dom.pageTools.hidden = !hasGame;
    dom.progress.hidden = !hasGame;
    dom.pageTitle.textContent = t(hasGame ? 'gameTitle' : 'setupTitle');
    dom.pageIntro.textContent = t(hasGame ? 'gameIntro' : 'setupIntro');
    dom.shortcut.hidden = !hasGame;

    if (!hasGame) return;

    updateBoard(animateDraw);
    updateTally();
    updateStage(animateDraw);
    updateLatestPrizes(animatePrizes);
    updatePreviousPrizes();
    applyPersistenceCopy();
  }

  function updateBoard(animate) {
    const drawnSet = new Set(game.drawn);
    const latest = game.drawn.length ? game.drawn[game.drawn.length - 1] : null;

    for (const [number, cell] of cells) {
      const isDrawn = drawnSet.has(number);
      const name = neapolitanName(number);
      cell.classList.toggle('is-drawn', isDrawn);
      cell.classList.toggle('is-last', number === latest);
      cell.classList.remove('is-new');
      cell.setAttribute(
        'aria-label',
        `${t('numberWord')} ${number}${name ? `, ${name}` : ''}, ${isDrawn ? t('drawnCell') : t('pendingCell')}`
      );
      if (name) {
        cell.title = name;
      } else {
        cell.removeAttribute('title');
      }
    }

    if (!animate || latest === null) return;
    const fresh = cells.get(latest);
    if (!fresh) return;
    void fresh.offsetWidth;
    fresh.classList.add('is-new');
    window.setTimeout(() => fresh.classList.remove('is-new'), 560);
  }

  function updateTally() {
    const count = game.drawn.length;
    const active = game.cards.length - game.disabled.length;
    dom.drawnCount.textContent = String(count);
    dom.progress.setAttribute('aria-valuenow', String(count));
    dom.progressFill.style.width = `${(count / TOTAL) * 100}%`;
    dom.drawButton.disabled = count >= TOTAL;
    dom.resetButton.hidden = count === 0;
    dom.shortcut.hidden = count >= TOTAL;
    dom.cardsButtonLabel.textContent = t('cardsTrigger', active);
  }

  function updateStage(animate) {
    const latest = game.drawn.length ? game.drawn[game.drawn.length - 1] : null;
    const full = game.drawn.length >= TOTAL;
    const name = latest === null ? '' : neapolitanName(latest);

    dom.lastNumber.classList.toggle('is-empty', latest === null);
    dom.lastNumber.textContent = latest === null ? '0' : String(latest);
    dom.lastName.textContent = name;
    dom.lastName.hidden = !name;
    dom.lastNumberSr.textContent = latest === null ? '' : t('lastNumberSr', latest, name);
    dom.stageOrdinal.hidden = latest === null;
    dom.stageOrdinal.textContent = latest === null ? '' : t('drawOrdinal', game.drawn.length);

    if (latest === null) {
      dom.stageStatus.textContent = t('noDraw');
    } else if (full) {
      dom.stageStatus.textContent = t('allDrawn');
    } else {
      dom.stageStatus.textContent = t('remaining', TOTAL - game.drawn.length);
    }

    dom.lastNumber.classList.remove('is-dealing');
    if (latest !== null && animate) {
      void dom.lastNumber.offsetWidth;
      dom.lastNumber.classList.add('is-dealing');
    }
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
    const drawn = [...game.drawn, number];
    const result = Prizes.detect({
      cards: game.cards,
      drawnSet: new Set(drawn),
      disabled: game.disabled,
      seen: game.seen,
    });

    game = { ...game, drawn, seen: result.seen };
    if (result.awards.length) {
      game = { ...game, log: [...game.log, { number, awards: result.awards }] };
    }

    persistGame();
    render({ animateDraw: true, animatePrizes: true });

    let message = t('drawAnnounce', number, TOTAL - drawn.length, neapolitanName(number));
    for (const group of groupAwards(result.awards)) {
      message += ` ${t('prizeLine', tierLabel(group.tier), group.cards)}`;
    }
    announce(message);
  }

  function resetGame() {
    if (!game) return;
    game = {
      ...game,
      drawn: [],
      log: [],
      seen: Prizes.emptySeen(game.cards.length),
    };
    persistGame();
    render();
    announce(t('resetAnnounce'));
  }

  function randomIndex(max) {
    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / max) * max;
      do {
        globalThis.crypto.getRandomValues(buffer);
      } while (buffer[0] >= limit);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function generateCards(event) {
    event.preventDefault();
    const count = readCount();
    if (count === null) {
      validateCount();
      return;
    }

    clearSetupError();
    dom.downloadButton.disabled = true;

    try {
      const cards = Cards.generate(count);
      const pdf = Pdf.buildPdf({ cards, theme: selectedTheme, lang: resolvedLang });
      downloadPdf(pdf, Pdf.pdfFilename(count));
      game = {
        cards,
        printTheme: selectedTheme,
        drawn: [],
        disabled: [],
        seen: Prizes.emptySeen(count),
        log: [],
      };
      persistGame();
      render();
      announce(t('generatedAnnounce', count));
      dom.drawButton.focus();
    } catch (error) {
      showSetupError(t('generateError'));
    } finally {
      dom.downloadButton.disabled = false;
      validateCount();
    }
  }

  function downloadPdf(pdf, filename) {
    const blob = new Blob([pdf], { type: 'application/pdf' });
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
      downloadPdf(pdf, Pdf.pdfFilename(game.cards.length));
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
    dom.cardsGrid.replaceChildren();

    game.cards.forEach((card, index) => {
      const number = index + 1;
      const isActive = !off.has(number);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-chip';
      button.dataset.card = String(number);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', t('cardChip', number, isActive));
      button.textContent = String(number);
      dom.cardsGrid.appendChild(button);
    });
  }

  function toggleCard(number) {
    if (!game) return;
    const off = new Set(game.disabled);
    let enabled = false;
    if (off.has(number)) {
      off.delete(number);
      enabled = true;
    } else {
      off.add(number);
    }

    game = { ...game, disabled: [...off].sort((a, b) => a - b) };
    if (enabled) {
      game = {
        ...game,
        seen: Prizes.syncSeen(game.seen, number, game.cards[number - 1], new Set(game.drawn)),
      };
    }

    persistGame();
    render();
    renderCardsDrawer();
    const chip = dom.cardsGrid.querySelector(`[data-card="${number}"]`);
    if (chip) chip.focus();
  }

  function applyRange(mode) {
    if (!game) return;
    const max = game.cards.length;
    const numbers = Cards.parseRanges(dom.rangeInput.value, max);
    if (!numbers.length) {
      showRangeError(t('rangeError', max));
      return;
    }

    const off = new Set(game.disabled);
    let changed = false;
    for (const number of numbers) {
      if (mode === 'disable') {
        if (!off.has(number)) {
          off.add(number);
          changed = true;
        }
      } else if (off.has(number)) {
        off.delete(number);
        game = {
          ...game,
          seen: Prizes.syncSeen(game.seen, number, game.cards[number - 1], new Set(game.drawn)),
        };
        changed = true;
      }
    }

    if (changed) {
      game = { ...game, disabled: [...off].sort((a, b) => a - b) };
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
    return Number.isInteger(value) && value >= 1 && value <= 100 ? value : null;
  }

  function clampCount() {
    if (dom.cardCount.value.trim() === '') return;
    const value = Number(dom.cardCount.value);
    if (!Number.isFinite(value)) return;
    dom.cardCount.value = String(Math.min(100, Math.max(1, Math.round(value))));
    validateCount();
  }

  function stepCount(delta) {
    const current = readCount() ?? DEFAULT_COUNT;
    dom.cardCount.value = String(Math.min(100, Math.max(1, current + delta)));
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
    const effective = prefs.theme === 'system'
      ? (darkMedia.matches ? 'dark' : 'light')
      : prefs.theme;
    html.dataset.theme = effective;
    if (themeMeta) themeMeta.content = THEME_COLORS[effective] || THEME_COLORS.light;
  }

  function applyLanguage() {
    resolvedLang = prefs.lang === 'system' ? systemLang : prefs.lang;
    const dict = COPY[resolvedLang];
    html.lang = resolvedLang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = dict[element.dataset.i18n];
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const value = dict[element.dataset.i18nAria];
      if (typeof value === 'string') element.setAttribute('aria-label', value);
    });

    dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
    applyDocumentMeta(dict);
    render();
    applyPersistenceCopy();
  }

  function applyDocumentMeta(dict) {
    document.title = dict.docTitle;
    setMeta('meta[name="description"]', dict.docDescription);
    setMeta('meta[property="og:title"]', dict.ogTitle);
    setMeta('meta[property="og:description"]', dict.ogDescription);
  }

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  }

  function applyPersistenceCopy() {
    if (!dom.savedLabel || !dom.settingsLede) return;
    dom.savedLabel.textContent = canPersist ? t('saved') : t('notSaved');
    dom.settingsLede.textContent = canPersist ? t('settingsLede') : t('settingsLedePlain');
  }

  function syncControls() {
    dom.languageInputs.forEach(input => { input.checked = input.value === prefs.lang; });
    dom.themeInputs.forEach(input => { input.checked = input.value === prefs.theme; });
    dom.namesInput.checked = prefs.names;
  }

  function announce(message) {
    dom.liveRegion.textContent = message;
  }

  function bindEvents() {
    dom.setupForm.addEventListener('submit', generateCards);
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

    dom.languageInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.lang = input.value;
        persistPrefs();
        applyLanguage();
      });
    });
    dom.themeInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.theme = input.value;
        persistPrefs();
        applyTheme();
      });
    });
    dom.namesInput.addEventListener('change', () => {
      prefs.names = dom.namesInput.checked;
      persistPrefs();
      render();
    });

    dom.cardsGrid.addEventListener('click', event => {
      const button = event.target.closest('button[data-card]');
      if (!button) return;
      toggleCard(Number(button.dataset.card));
    });
    dom.rangeInput.addEventListener('input', hideRangeError);
    dom.disableRange.addEventListener('click', () => applyRange('disable'));
    dom.enableRange.addEventListener('click', () => applyRange('enable'));
    dom.redownloadButton.addEventListener('click', redownloadPdf);
    dom.newCardsButton.addEventListener('click', openNewCardsDialog);

    document.addEventListener('keydown', handleShortcut);
    darkMedia.addEventListener('change', () => {
      if (prefs.theme === 'system') applyTheme();
    });
    window.addEventListener('languagechange', () => {
      systemLang = detectSystemLanguage();
      dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
      if (prefs.lang === 'system') applyLanguage();
    });
  }

  function handleShortcut(event) {
    if (event.repeat || event.defaultPrevented) return;
    if (event.key !== ' ' && event.code !== 'Space') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!game || document.querySelector('dialog[open]')) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, select, textarea, [contenteditable]')) return;
    if (dom.drawButton.disabled) return;
    event.preventDefault();
    drawNumber();
  }

  function openSettingsDialog() {
    syncControls();
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

  function openDialog(dialog) {
    html.classList.add('modal-open');
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog, value = '') {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close(value);
    } else {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    }
    syncModalLock();
  }

  function syncModalLock() {
    if (!document.querySelector('dialog[open]')) html.classList.remove('modal-open');
  }

  function detectSystemLanguage() {
    const languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const language of languages) {
      const base = String(language || '').toLowerCase().split('-')[0];
      if (LANGUAGES.includes(base)) return base;
    }
    return 'en';
  }

  function loadPrefs() {
    const stored = readStored(PREFS_KEY, {}) || {};
    return {
      lang: ['system', ...LANGUAGES].includes(stored.lang) ? stored.lang : 'system',
      theme: THEMES.includes(stored.theme) ? stored.theme : 'system',
      names: stored.names === true,
    };
  }

  function loadGame() {
    const stored = readStored(STATE_KEY, null);
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
      printTheme: Pdf.THEME_IDS.includes(stored.printTheme) ? stored.printTheme : DEFAULT_THEME,
      drawn,
      disabled,
      seen,
      log: sanitizeLog(stored.log, drawn, stored.cards.length),
    };
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

  function readStored(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persistGame() {
    if (!game || !canPersist) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(game));
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function clearStoredGame() {
    if (!canPersist) return;
    try {
      localStorage.removeItem(STATE_KEY);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function persistPrefs() {
    if (!canPersist) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function storageAvailable() {
    try {
      const key = 'bingo.test.v1';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
})();
