# Bingo

Tabellone digitale da 1 a 90 per una serata di bingo in famiglia o con amici. Estrae un numero alla volta, tiene l'ultimo in grande e mostra sempre tutti i numeri già usciti.

Apri `index.html` in un browser, oppure servi la cartella con un server statico:

```sh
python3 -m http.server 4173
```

Poi visita `http://localhost:4173`.

## Cosa fa

- Estrazione casuale uniforme tra i 90 numeri, senza ripetizioni.
- Ultimo numero in grande, conteggio degli estratti, barra di avanzamento e cronologia degli ultimi 12.
- Nomi tradizionali napoletani da 1 a 90, attivabili dalle impostazioni (spenti di default).
- Barra spaziatrice per estrarre un numero.
- Azzeramento protetto da una conferma.
- Partita e preferenze salvate in `localStorage`: ricaricare la pagina non perde la serata.
- Lingua: sistema, italiano, inglese, francese.
- Colore: sistema, chiaro, scuro, Natale, Crema, Rosso. Le tre varianti natalizie aggiungono pino, oro, crema, rosso e piccoli dettagli illustrati, senza cambiare gerarchia né struttura.
- Funziona senza build, senza framework e senza dipendenze esterne. Il font Gabarito è self-hosted con licenza OFL.

Non ci sono cartelle da generare, verdetto finale, suoni o multiplayer: il perimetro è documentato in `PRODUCT.md`.

## Struttura

```
index.html            pagina unica
assets/styles.css     token dei temi e stili dell'app
assets/app.js         stato, i18n, estrazione, dialoghi
assets/fonts/         Gabarito (woff2) e licenza
favicon.svg
PRODUCT.md            verità di prodotto e assunzioni
DESIGN.md             sistema visivo e regole di interfaccia
```

Lo stato della partita è in `tombola.state.v1`; le preferenze in `tombola.prefs.v1`. Le chiavi conservano il vecchio nome per non perdere le partite già salvate.
