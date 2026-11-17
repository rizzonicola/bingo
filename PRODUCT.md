# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML, CSS and JavaScript, no build step and no runtime dependencies. The board is a one-page tool that must work offline once loaded.

## Users

Chi organizza una serata di bingo in famiglia o con amici: tiene il portatile o il tablet sul tavolo, davanti ai giocatori, e chiama i numeri uno alla volta. I giocatori guardano lo schermo da una certa distanza e devono riconoscere subito l'ultimo numero uscito e quelli già estratti.

## Product Purpose

Sostituire il sacchetto e le palline con un tabellone digitale leggibile da lontano: estrarre i 90 numeri senza ripetizioni, mostrare l'ultimo estratto in grande, tenere traccia di tutti quelli usciti e conservare la partita se la pagina viene ricaricata.

## Positioning

Nessuna registrazione, nessuna cartella da generare, nessun contorno da sala da gioco: una sola schermata pulita, pensata per essere proiettata o guardata insieme, con una gerarchia che mette l'ultima estrazione davanti a tutto.

## Operating Context

- La pagina viene aperta prima dell'inizio della partita, spesso in penombra, su uno schermo condiviso.
- Si estrae un numero alla volta, con una pausa tra un'estrazione e l'altra.
- Un tocco o la barra spaziatrice devono bastare: chi conduce la partita non vuole cercare comandi.
- La partita può durare a lungo e la pagina può essere ricaricata; lo stato resta sul dispositivo.

## Capabilities and Constraints

- Tabellone completo da 1 a 90, sempre visibile, con i numeri estratti evidenziati e l'ultimo distinto.
- Estrazione casuale uniforme tra i numeri rimasti, senza ripetizioni.
- Ultimo numero in grande, conteggio degli estratti e dei numeri rimasti, cronologia recente.
- Barra spaziatrice come scorciatoia per estrarre, con rispetto delle impostazioni di movimento del sistema.
- Azzeramento della partita protetto da una conferma.
- Stato della partita e preferenze salvati in `localStorage`, con degradazione silenziosa se lo storage non è disponibile.
- Lingua: sistema (predefinita), italiano, inglese, francese. Con "sistema" la lingua segue quella del browser; se non è una delle tre, si usa l'inglese.
- Nomi napoletani: interruttore nelle impostazioni, spento di default. Quando è acceso, il nome tradizionale compare sotto l'ultimo numero e nelle etichette di tabellone e cronologia.
- Colore: sistema (predefinito), chiaro, scuro, Natale, Crema, Rosso. Con "sistema" il tema segue `prefers-color-scheme`; le tre varianti natalizie sono temi dedicati e restano stabili al cambio di tema di sistema.
- Verdetto finale, generazione di cartelle, suoni e multiplayer non fanno parte di questa versione.

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

## Accessibility & Inclusion

- Contrasto testo conforme WCAG AA in tutti i temi; il numero grande supera AA.
- Ogni controllo ha un nome accessibile; i cambi di stato vengono annunciati con una live region.
- Focus visibile, navigazione da tastiera, dialoghi nativi con chiusura con Esc.
- `prefers-reduced-motion` eliminato o ridotto in tutte le animazioni.
