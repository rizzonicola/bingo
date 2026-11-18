# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML, CSS and JavaScript, no build step and no runtime dependencies. Two pages share the same visual system: the board and the cards game. Both must work offline once loaded.

## Users

Chi organizza una serata di bingo in famiglia o con amici: tiene il portatile o il tablet sul tavolo, davanti ai giocatori, e chiama i numeri uno alla volta. I giocatori guardano lo schermo da una certa distanza e devono riconoscere subito l'ultimo numero uscito e quelli già estratti. Chi usa le cartelle stampate ha bisogno anche di generarle, distribuirle e sapere quali hanno vinto.

## Product Purpose

Sostituire il sacchetto e le palline con un tabellone digitale leggibile da lontano: estrarre i 90 numeri senza ripetizioni, mostrare l'ultimo estratto in grande, tenere traccia di tutti quelli usciti e conservare la partita se la pagina viene ricaricata. Per chi gioca con le cartelle, generare un PDF A4 da stampare e seguire ambo, terna, quaterna, cinquina e bingo sulle cartelle attive.

## Positioning

Nessuna registrazione, nessun contorno da sala da gioco: due schermate pulite, pensate per essere proiettate o guardate insieme. Il tabellone mette l'ultima estrazione davanti a tutto; la modalità cartelle aggiunge il PDF da stampare e i premi, senza trasformare il gioco in una piattaforma.

## Operating Context

- La pagina viene aperta prima dell'inizio della partita, spesso in penombra, su uno schermo condiviso.
- Con le cartelle stampate, la preparazione avviene prima: si sceglie il numero, si scarica il PDF, si stampa e si distribuisce. Poi si apre la stessa schermata per chiamare i numeri.
- Si estrae un numero alla volta, con una pausa tra un'estrazione e l'altra.
- Un tocco o la barra spaziatrice devono bastare: chi conduce la partita non vuole cercare comandi.
- La partita può durare a lungo e la pagina può essere ricaricata; lo stato resta sul dispositivo, separato tra tabellone e cartelle.

## Capabilities and Constraints

- Tabellone completo da 1 a 90, sempre visibile, con i numeri estratti evidenziati e l'ultimo distinto.
- Estrazione casuale uniforme tra i numeri rimasti, senza ripetizioni.
- Ultimo numero in grande, conteggio degli estratti e dei numeri rimasti, cronologia recente.
- Barra spaziatrice come scorciatoia per estrarre, con rispetto delle impostazioni di movimento del sistema.
- Azzeramento della partita protetto da una conferma.
- Modalità cartelle separata: da 1 a 5.000 cartelle numerate, tre per pagina A4, generate con avanzamento visibile e scaricate con un pulsante esplicito senza passare dal dialogo di stampa.
- Quattro temi di stampa: Classico, Natale, Crema e Bianco e nero.
- Ultimi 12 numeri estratti sotto il tabellone anche nella modalità cartelle, con gli stessi chip della modalità principale.
- Premi cercati solo sulle cartelle attive: ambo, terna, quaterna, cinquina e bingo, annunciati con i numeri delle cartelle. Ogni livello si assegna una volta sola, alla prima estrazione che lo raggiunge. Le cartelle non distribuite si disattivano una per una o per intervalli come `8-20, 27`, e non generano premi.
- Riaprire una cartella non ripete i premi già passati: la sincronizzazione è silenziosa. "Nuove cartelle" azzera la partita e torna ai valori iniziali.
- Stato della partita e preferenze salvati in `localStorage`, con degradazione silenziosa se lo storage non è disponibile. La partita delle cartelle usa una chiave separata da quella del tabellone.
- Lingua: sistema (predefinita), italiano, inglese, francese. Con "sistema" la lingua segue quella del browser; se non è una delle tre, si usa l'inglese.
- Nomi napoletani: interruttore nelle impostazioni, spento di default. Quando è acceso, il nome tradizionale compare sotto l'ultimo numero e nelle etichette di tabellone e cronologia.
- Colore: sistema (predefinito), chiaro, scuro, Natale, Crema, Rosso. Con "sistema" il tema segue `prefers-color-scheme`; le tre varianti natalizie sono temi dedicati e restano stabili al cambio di tema di sistema.
- Il tabellone principale non emette verdetti: i premi appartengono solo alla modalità cartelle. Suoni, account, multiplayer e cartelle digitali da giocare sullo schermo non fanno parte di questa versione.

## Brand Commitments

- Nome di lavoro: Bingo (assunto; nessun marchio fornito).
- Colori richiesti e vincolanti: verde acqua come accento operativo e grigio scuro come base nei temi standard; le varianti Natale sono eccezioni festive documentate in `DESIGN.md`.
- Niente estetica da sala bingo, casinò o festa per bambini: è uno strumento da tavolo, non un gioco d'azzardo.

## Evidence on Hand

Nessun asset del cliente, nessuna fotografia, nessun logo esistente. Il marchio, il tabellone e gli stati sono disegnati per questo progetto. Non esistono recensioni, dati d'uso, prezzi o promesse da mostrare.

## Product Principles

1. L'ultimo numero è il protagonista: deve leggersi a colpo d'occhio, anche a due metri di distanza.
2. Il tabellone completo resta sempre il contesto: si vede cosa è uscito e cosa manca senza cambiare schermata.
3. Un gesto, un numero: l'azione principale non deve mai competere con controlli secondari.
4. Lo stato sopravvive alla ricarica e a un tocco sbagliato non si perde una serata.
5. Le preferenze sono invisibili finché non servono, e non cambiano mai il significato dei colori di stato.
6. I premi si leggono da lontano: il numero delle cartelle è grande quanto basta per essere chiamato senza avvicinarsi allo schermo.

## Accessibility & Inclusion

- Contrasto testo conforme WCAG AA in tutti i temi; il numero grande supera AA.
- Ogni controllo ha un nome accessibile; i cambi di stato vengono annunciati con una live region.
- Focus visibile, navigazione da tastiera, dialoghi nativi con chiusura con Esc.
- `prefers-reduced-motion` eliminato o ridotto in tutte le animazioni.
