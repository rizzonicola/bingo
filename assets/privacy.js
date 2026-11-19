(function (root) {
  'use strict';

  const {
    PREFS_KEY,
    loadPrefs,
    detectSystemLanguage,
    applyTheme,
    applyLanguage,
    writeStored,
    storageAvailable,
  } = root.BingoCommon;
  const { BINGO_COPY } = root;

  const COPY = {
    it: {
      ...BINGO_COPY.it,
      docTitle: 'Privacy · Bingo',
      docDescription: 'Informativa privacy di Bingo: nessun account, nessun tracker, dati di gioco solo nel browser.',
      ogTitle: 'Privacy · Bingo',
      ogDescription: 'Informativa privacy di Bingo: nessun account, nessun tracker, dati di gioco solo nel browser.',
      privacySkip: 'Vai al contenuto',
      privacyTitle: 'Informativa sulla privacy',
      privacyIntro: 'Cosa fa e cosa non fa il sito con i tuoi dati.',
      privacyUpdated: 'Ultimo aggiornamento: 19 novembre 2026.',
      privacyLang: "Lingua dell'informativa",
    },
    en: {
      ...BINGO_COPY.en,
      docTitle: 'Privacy · Bingo',
      docDescription: 'Bingo privacy notice: no accounts, no trackers, game data stays in the browser.',
      ogTitle: 'Privacy · Bingo',
      ogDescription: 'Bingo privacy notice: no accounts, no trackers, game data stays in the browser.',
      privacySkip: 'Skip to content',
      privacyTitle: 'Privacy notice',
      privacyIntro: 'What the site does and does not do with your data.',
      privacyUpdated: 'Last updated: 19 November 2026.',
      privacyLang: 'Notice language',
    },
    fr: {
      ...BINGO_COPY.fr,
      docTitle: 'Confidentialité · Bingo',
      docDescription: 'Politique de confidentialité de Bingo : aucun compte, aucun traceur, données de jeu uniquement dans le navigateur.',
      ogTitle: 'Confidentialité · Bingo',
      ogDescription: 'Politique de confidentialité de Bingo : aucun compte, aucun traceur, données de jeu uniquement dans le navigateur.',
      privacySkip: 'Aller au contenu',
      privacyTitle: 'Politique de confidentialité',
      privacyIntro: 'Ce que le site fait et ne fait pas avec vos données.',
      privacyUpdated: 'Dernière mise à jour : 19 novembre 2026.',
      privacyLang: 'Langue de la politique',
    },
  };

  const prefs = loadPrefs();
  const systemLang = detectSystemLanguage();
  const canPersist = storageAvailable();

  applyTheme(prefs, matchMedia('(prefers-color-scheme: dark)'));
  showLanguage(applyLanguage({ prefs, systemLang, copy: COPY }));

  document.querySelectorAll('[data-lang-switch]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      prefs.lang = link.dataset.langSwitch;
      if (canPersist) {
        try { writeStored(PREFS_KEY, prefs); } catch (error) {}
      }
      const lang = applyLanguage({ prefs, systemLang, copy: COPY });
      showLanguage(lang);
      const section = document.querySelector(`[data-lang="${lang}"]`);
      if (section) section.focus({ preventScroll: true });
    });
  });

  function showLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(section => {
      section.hidden = section.dataset.lang !== lang;
    });
    document.querySelectorAll('[data-lang-switch]').forEach(link => {
      if (link.dataset.langSwitch === lang) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
})(globalThis);
