# Bingo

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Tabellone digitale da 1 a 90 per una serata di bingo in famiglia o con amici. Estrae un numero alla volta, tiene l'ultimo in grande e mostra sempre tutti i numeri già usciti. La modalità Cartelle aggiunge cartelle numerate da stampare e il conteggio dei premi sulle cartelle attive.

Apri `index.html` in un browser, oppure servi la cartella con un server statico:

```sh
python3 -m http.server 4173
```

Poi visita `http://localhost:4173`. La modalità cartelle è su `cards.html`; il link nella barra superiore passa dall'una all'altra.

## Cosa fa

### Tabellone

- Estrazione casuale uniforme tra i 90 numeri, senza ripetizioni.
- Ultimo numero in grande, conteggio degli estratti, barra di avanzamento e cronologia degli ultimi 12.
- Nomi tradizionali napoletani da 1 a 90, attivabili dalle impostazioni (spenti di default).
- Barra spaziatrice per estrarre un numero.
- Azzeramento protetto da una conferma.
- Partita e preferenze salvate in `localStorage`: ricaricare la pagina non perde la serata.

### Cartelle

- Da 1 a 5.000 cartelle numerate, tre per pagina A4, con un PDF scaricato direttamente (senza dialogo di stampa).
- Generazione a blocchi con avanzamento visibile; quando il PDF è pronto compare il pulsante per scaricarlo e iniziare la partita.
- Quattro temi di stampa: Classico, Natale, Crema e Bianco e nero.
- Ultimi 12 numeri estratti sotto il tabellone, come nella modalità principale.
- Ambo, terna, quaterna, cinquina e bingo cercati solo sulle cartelle attive e assegnati una volta sola, alla prima estrazione che li raggiunge; tutte le cartelle che lo raggiungono in quella estrazione vengono annunciate.
- Cartelle non distribuite disattivabili una per una o per intervalli come `8-20, 27`; non generano premi. Il gestore mostra 200 cartelle per pagina.
- Riaprire una cartella non ripete i premi già passati; "Nuove cartelle" azzera la partita e torna ai valori iniziali.
- Partita delle cartelle salvata separatamente dal tabellone.

### Comune

- Lingua: sistema, italiano, inglese, francese.
- Colore: sistema, chiaro, scuro, Natale, Crema, Rosso. Le tre varianti natalizie aggiungono pino, oro, crema, rosso e piccoli dettagli illustrati, senza cambiare gerarchia né struttura.
- Funziona senza build, senza framework e senza dipendenze esterne. Il font Gabarito è self-hosted con licenza OFL.

I suoni, gli account, il multiplayer e le cartelle digitali da giocare sullo schermo restano fuori dal perimetro, documentato in `PRODUCT.md`.

## Struttura

```
index.html            tabellone
cards.html            modalità cartelle: setup, PDF, partita e premi
assets/styles.css     token dei temi e stili condivisi
assets/cartelle.css   layout della modalità cartelle
assets/copy.js        testi condivisi tra tabellone e cartelle
assets/common.js      costanti, preferenze, lingua, tema, dialoghi e storage
assets/board-ui.js    tabellone, ultimo numero, conteggi e cronologia
assets/game-state.js  stato puro delle cartelle: caricamento, estrazione, premi, intervalli
assets/app.js         solo logica del tabellone
assets/cartelle.js    setup, PDF e drawer delle cartelle
assets/names.js       nomi napoletani condivisi
assets/cards.js       generazione, validazione e intervalli delle cartelle
assets/prizes.js      soglie dei premi e sincronizzazione silenziosa
assets/pdf.js         palette di stampa e scrittore PDF A4
assets/fonts/         Gabarito (woff2) e licenza
assets/privacy.js     selezione della lingua nell'informativa privacy
tests/                test Node dei moduli puri
favicon.svg
privacy.html          informativa privacy in italiano, inglese e francese
LICENSE               GNU GPL v3
_redirects            vecchio indirizzo /cartelle reindirizzato a /cards
PRODUCT.md            verità di prodotto e assunzioni
DESIGN.md             sistema visivo e regole di interfaccia
```

Lo stato del tabellone è in `tombola.state.v1`; quello delle cartelle in `bingo.cards.v1`. Le preferenze sono in `tombola.prefs.v1`. Le chiavi del tabellone conservano il vecchio nome per non perdere le partite già salvate; le due partite sono indipendenti.

## Test

I moduli puri (`cards.js`, `prizes.js`, `pdf.js`, `game-state.js`) si provano senza browser:

```sh
node --test tests/*.test.mjs
```

Le prove nel browser usano una pagina servita da HTTP, non `file://`, per poter leggere e scrivere `localStorage`.

## Progetto e dipendenze

[![GitHub](https://img.shields.io/badge/GitHub-rizzonicola%2Fbingo-181717?logo=github&logoColor=white)](https://github.com/rizzonicola/bingo)

Il codice è su GitHub: <https://github.com/rizzonicola/bingo>.

Non ci sono dipendenze runtime, build o CDN: HTML, CSS e JavaScript classici vengono serviti così come sono. Il font Gabarito è self-hosted in `assets/fonts/` con licenza SIL Open Font License 1.1 (`assets/fonts/OFL.txt`) e resta fuori dal codice GPL. I test usano solo il runner integrato di Node.js. Il sito è pubblicato come sito statico su Cloudflare Pages.

## Privacy e licenza

La pagina `privacy.html` spiega in italiano, inglese e francese quali dati restano nel browser e quale trattamento tecnico può svolgere Cloudflare Pages. Il sito non usa cookie propri, analytics o tracker e non richiede un banner di consenso.

Il codice è distribuito con GNU General Public License v3.0: vedi `LICENSE`. La licenza non copre il font Gabarito, che resta sotto OFL 1.1.

Questa documentazione legale è scritta in modo pratico e non sostituisce il parere di un avvocato: se il progetto diventa commerciale o cambia il trattamento dei dati, va rivista.
