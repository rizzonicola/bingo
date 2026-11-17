(function (root) {
  'use strict';

  function create({
    board,
    recentList,
    recentEmpty,
    lastNumber,
    lastName,
    lastNumberSr,
    stageOrdinal,
    stageStatus,
    drawnCount,
    progress,
    progressFill,
    drawButton,
    resetButton,
    shortcut,
    total,
    names,
    t,
  }) {
    const cells = new Map();

    function build() {
      const fragment = document.createDocumentFragment();
      for (let n = 1; n <= total; n += 1) {
        const cell = document.createElement('li');
        cell.className = 'cell';
        cell.dataset.number = String(n);
        cell.textContent = String(n).padStart(2, '0');
        cells.set(n, cell);
        fragment.appendChild(cell);
      }
      board.replaceChildren(fragment);
    }

    function latestOf(drawn) {
      return drawn.length ? drawn[drawn.length - 1] : null;
    }

    function addName(element, number) {
      const name = names(number);
      if (name) {
        element.title = name;
        element.setAttribute('aria-label', `${number}, ${name}`);
      }
    }

    function renderDrawn(drawn, animate) {
      const drawnSet = new Set(drawn);
      const latest = latestOf(drawn);

      for (const [number, cell] of cells) {
        const isDrawn = drawnSet.has(number);
        const name = names(number);
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

      if (animate && latest !== null) {
        const fresh = cells.get(latest);
        if (fresh) {
          void fresh.offsetWidth;
          fresh.classList.add('is-new');
          window.setTimeout(() => fresh.classList.remove('is-new'), 560);
        }
      }

      const recent = drawn.slice(-12).reverse();
      recentEmpty.hidden = recent.length > 0;
      recentList.hidden = recent.length === 0;
      recentList.replaceChildren();

      recent.forEach((number, index) => {
        const chip = document.createElement('li');
        const name = names(number);
        chip.className = `history__chip${index === 0 ? ' is-latest' : ''}${animate && index === 0 ? ' is-new' : ''}`;
        chip.textContent = String(number).padStart(2, '0');
        addName(chip, number);
        recentList.appendChild(chip);
      });
    }

    function renderStage(drawn, animate) {
      const latest = latestOf(drawn);
      const full = drawn.length >= total;
      const name = latest === null ? '' : names(latest);

      lastNumber.classList.toggle('is-empty', latest === null);
      lastNumber.textContent = latest === null ? '0' : String(latest);
      lastName.textContent = name;
      lastName.hidden = !name;
      lastNumberSr.textContent = latest === null ? '' : t('lastNumberSr', latest, name);
      stageOrdinal.hidden = latest === null;
      stageOrdinal.textContent = latest === null ? '' : t('drawOrdinal', drawn.length);

      if (latest === null) {
        stageStatus.textContent = t('noDraw');
      } else if (full) {
        stageStatus.textContent = t('allDrawn');
      } else {
        stageStatus.textContent = t('remaining', total - drawn.length);
      }

      lastNumber.classList.remove('is-dealing');
      if (latest !== null && animate) {
        void lastNumber.offsetWidth;
        lastNumber.classList.add('is-dealing');
      }
    }

    function renderTally(drawn) {
      const count = drawn.length;
      drawnCount.textContent = String(count);
      progress.setAttribute('aria-valuenow', String(count));
      progressFill.style.width = `${(count / total) * 100}%`;
      drawButton.disabled = count >= total;
      resetButton.hidden = count === 0;
      shortcut.hidden = count >= total;
    }

    return { build, renderDrawn, renderStage, renderTally };
  }

  root.BingoBoardUi = { create };
})(globalThis);
