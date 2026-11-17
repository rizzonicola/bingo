# Bingo

Tabellone digitale da 1 a 90 per una serata di bingo in famiglia o con amici. Estrae un numero alla volta, tiene l'ultimo in grande e mostra sempre tutti i numeri già usciti. La modalità Cartelle aggiunge cartelle numerate da stampare e il conteggio dei premi sulle cartelle attive.

Apri `index.html` in un browser, oppure servi la cartella con un server statico:

```sh
python3 -m http.server 4173
```

Poi visita `http://localhost:4173`. La modalità cartelle è su `cartelle.html`; il link nella barra superiore passa dall'una all'altra.

## Cosa fa

### Tabellone

- Estrazione casuale uniforme tra i 90 numeri, senza ripetizioni.
- Ultimo numero in grande, conteggio degli estratti, barra di avanzamento e cronologia degli ultimi 12.
- Nomi tradizionali napoletani da 1 a 90, attivabili dalle impostazioni (spenti di default).
- Barra spaziatrice per estrarre un numero.
- Azzeramento protetto da una conferma.
- Partita e preferenze salvate in `localStorage`: ricaricare la pagina non perde la serata.

### Cartelle

- Da 1 a 100 cartelle numerate, tre per pagina A4, con un PDF scaricato direttamente (senza dialogo di stampa).
- Quattro temi di stampa: Classico, Natale, Crema e Bianco e nero.
- Ultimi 12 numeri estratti sotto il tabellone, come nella modalità principale.
- Ambo, terna, quaterna, cinquina e bingo cercati solo sulle cartelle attive e assegnati una volta sola, alla prima estrazione che li raggiunge; tutte le cartelle che lo raggiungono in quella estrazione vengono annunciate.
- Cartelle non distribuite disattivabili una per una o per intervalli come `8-20, 27`; non generano premi.
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
cartelle.html         modalità cartelle: setup, PDF, partita e premi
assets/styles.css     token dei temi e stili condivisi
assets/cartelle.css   layout della modalità cartelle
assets/app.js         stato, i18n, estrazione, dialoghi del tabellone
assets/cartelle.js    setup, stato, estrazione, premi e drawer delle cartelle
assets/names.js       nomi napoletani condivisi
assets/cards.js       generazione, validazione e intervalli delle cartelle
assets/prizes.js      soglie dei premi e sincronizzazione silenziosa
assets/pdf.js         palette di stampa e scrittore PDF A4
assets/fonts/         Gabarito (woff2) e licenza
tests/                test Node dei moduli puri
favicon.svg
PRODUCT.md            verità di prodotto e assunzioni
DESIGN.md             sistema visivo e regole di interfaccia
```

Lo stato del tabellone è in `tombola.state.v1`; quello delle cartelle in `bingo.cards.v1`. Le preferenze sono in `tombola.prefs.v1`. Le chiavi del tabellone conservano il vecchio nome per non perdere le partite già salvate; le due partite sono indipendenti.

## Test

I moduli puri (`cards.js`, `prizes.js`, `pdf.js`) si provano senza browser:

```sh
node --test tests/cards.test.mjs tests/prizes.test.mjs tests/pdf.test.mjs
```

Le prove nel browser usano una pagina servita da HTTP, non `file://`, per poter leggere e scrivere `localStorage`.
