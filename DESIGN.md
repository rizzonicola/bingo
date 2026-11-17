---
name: Tombola
description: Tabellone digitale da tavolo per estrarre i 90 numeri della tombola
colors:
  table-teal: "#0d766e"
  table-teal-deep: "#095e58"
  dim-room-mint: "#2fd8c2"
  dim-room-mint-bright: "#67ead8"
  green-paper: "#e8ece7"
  green-surface: "#f6f8f4"
  raised-white: "#ffffff"
  slate-ink: "#1a2122"
  mist-grey: "#566360"
  green-night: "#111516"
  night-surface: "#181e1f"
  night-raised: "#1f2627"
  night-cell: "#1e2526"
  night-ink: "#f2f3ec"
  night-muted: "#a4aeaa"
  signal-red: "#b42318"
  signal-red-night: "#e5484d"
typography:
  display:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(104px, 9.6vw, 142px)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.2vw, 34px)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0em"
rounded:
  cell: "8px"
  control: "10px"
  md: "12px"
  panel: "16px"
  sheet: "20px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.table-teal}"
    textColor: "#f5fbf8"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.table-teal-deep}"
    textColor: "#f5fbf8"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.raised-white}"
    textColor: "{colors.mist-grey}"
    rounded: "{rounded.md}"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  choice:
    backgroundColor: "{colors.raised-white}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "58px"
  choice-selected:
    backgroundColor: "rgba(13, 118, 110, 0.09)"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.md}"
  board-cell:
    backgroundColor: "{colors.raised-white}"
    textColor: "{colors.mist-grey}"
    typography: "{typography.body}"
    rounded: "{rounded.cell}"
  board-cell-drawn:
    backgroundColor: "{colors.table-teal}"
    textColor: "#f5fbf8"
    typography: "{typography.body}"
    rounded: "{rounded.cell}"
  history-chip:
    backgroundColor: "transparent"
    textColor: "{colors.mist-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    width: "42px"
    height: "42px"
  history-chip-latest:
    backgroundColor: "{colors.table-teal}"
    textColor: "#f5fbf8"
    rounded: "{rounded.cell}"
    width: "42px"
    height: "42px"
  progress:
    backgroundColor: "{colors.table-teal}"
    rounded: "999px"
    height: "3px"
  number-stage:
    backgroundColor: "transparent"
    textColor: "{colors.table-teal}"
    typography: "{typography.display}"
  drawer:
    backgroundColor: "{colors.green-surface}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.sheet}"
---

# Design System: Tombola

## Overview

**Creative North Star: "Il tavolo di chi chiama"**

La pagina è un tavolo da gioco, non una vetrina. Chi conduce la partita siede davanti, chiama un numero alla volta e deve vedere subito l'ultima estrazione; i giocatori guardano lo stesso schermo da più lontano. Il sistema toglie tutto ciò che non serve a quel gesto: una sola azione primaria, un tabellone sempre intero, un numero grande che prende il centro. Il verde acqua è il segno lasciato sul tavolo; il grigio scuro è il piano su cui si gioca.

L'interfaccia resta piatta: pannelli netti, bordi sottili, nessuna ombra e nessun effetto decorativo. La profondità viene dai tre toni di superficie e dal velo scuro dei dialoghi, non dall'illusione di strati. La tipografia è una sola famiglia, usata per peso e scala: il numero estratto è l'unico elemento che può diventare enorme.

**Key Characteristics:**
- Un accento operativo, usato solo per lo stato del gioco e l'azione principale.
- Il tabellone 10 × 9 è sempre visibile e non si sposta.
- Il numero appena estratto domina la scena; il resto resta quieto.
- Superfici piatte separate da hairline, mai da ombre.
- Movimento breve e localizzato: il numero entra, il resto non si muove.

## Colors

Palette ristretta: un verde acqua che lavora, un grigio scuro che tiene il tavolo e due neutri di servizio. Chiaro e scuro non sono inversioni meccaniche: il tema scuro alza l'accento a un mint più luminoso per conservare la stessa gerarchia in penombra.

### Primary
- **Verde acqua da tavolo** (#0d766e): accento del tema chiaro. Riempie i numeri estratti, l'ultimo numero, il pulsante principale, la barra di avanzamento e il focus. È l'unico colore che indica un cambiamento di stato.
- **Verde acqua profondo** (#095e58): solo l'hover del pulsante principale nel tema chiaro.
- **Menta di sala buia** (#2fd8c2): lo stesso ruolo nel tema scuro, schiarito per restare leggibile sul fondo quasi nero; la variante luminosa (#67ead8) serve a hover, focus e numero in scena.

### Neutral
- **Carta verde** (#e8ece7): fondo del tema chiaro, un grigio caldo con una punta di verde.
- **Superficie verde** (#f6f8f4): pannelli e drawer sopra il fondo.
- **Bianco rialzato** (#ffffff): celle del tabellone e controlli selezionabili nel tema chiaro.
- **Inchiostro ardesia** (#1a2122): testo principale del tema chiaro.
- **Grigio nebbia** (#566360): testo secondario, numeri non estratti, etichette.
- **Notte verde** (#111516): fondo del tema scuro.
- **Superficie notte** (#181e1f) e **notte rialzata** (#1f2627): pannelli e controlli del tema scuro.
- **Cella notte** (#1e2526), **inchiostro notte** (#f2f3ec), **nebbia notte** (#a4aeaa): gli stessi ruoli nel tema scuro.
- **Rosso segnale** (#b42318, #e5484d): riservato alla conferma di azzeramento, mai al gioco.

### Named Rules
**La regola del segno.** Il verde acqua compare solo dove lo stato è cambiato o dove si compie l'azione: celle estratte, ultimo numero, pulsante principale, avanzamento, focus. Non è mai decorazione, sfondo o titolo.

**La regola del rosso.** Il rosso non descrive mai un numero o una fase della partita; esiste solo per l'azione irreversibile.

## Typography

**Display Font:** Gabarito (con ui-sans-serif, system-ui)
**Body Font:** Gabarito

**Character:** Una sola famiglia geometrica e amichevole, con pesi molto distanti tra loro. Il numero in scena usa il peso 800 e i numeri tabulari; le etichette restano a 600, il testo corrente a 400. Non c'è una seconda voce tipografica.

### Hierarchy
- **Display** (800, `clamp(104px, 9.6vw, 142px)`, 0.78): solo il numero dell'ultima estrazione. È il punto focale assoluto.
- **Headline** (800, `clamp(26px, 2.2vw, 34px)`, 1.06, -0.032em): titolo della pagina. Una riga quando lo spazio lo consente.
- **Title** (800, 24px, 1.1, -0.03em): titolo del drawer delle impostazioni.
- **Body** (400, 16px, 1.45): introduzione, stato della partita, testo dei dialoghi. Misura massima 64ch.
- **Label** (600, 13px, 1.3): titoli dei pannelli, legende, chip di cronologia, pulsanti secondari.

### Named Rules
**La regola di una voce.** Un solo carattere. La gerarchia si costruisce con scala, peso e colore, mai con una seconda famiglia.

**La regola del numero tabulare.** Ogni numero che può cambiare usa cifre tabulari; il tabellone non deve ballare quando un valore viene sostituito.

## Layout

Il guscio è largo al massimo 1480px, con padding laterale `clamp(16px, 3.6vw, 48px)`. La barra superiore è alta 64px e chiusa da una hairline; il piè di pagina resta ancorato in fondo alla finestra. Il corpo principale è una colonna flex che occupa lo spazio rimanente.

Sopra i 1000px il gioco è una griglia a due colonne: il tabellone occupa la sinistra e tutta l'altezza; la destra è divisa tra la scena dell'ultima estrazione e la cronologia. Il tabellone è una griglia 10 × 9 con celle quadrangolari, gap da 4 a 7px e pannello con padding da 10 a 16px. La scena ha il pulsante principale in fondo, sempre alla stessa distanza dal bordo.

Sotto i 1000px tutto diventa una colonna, nell'ordine scena → tabellone → cronologia; il tabellone conserva il rapporto 10/9 e il padding scende a 10px. Sotto i 640px l'intestazione perde la colonna laterale del conteggio, che passa sotto l'introduzione; i dialoghi diventano un foglio dal basso. Il ritmo usa 4, 8, 12, 16, 24, 32, 48px; le distanze tra pannelli sono 16px (12px su telefono).

## Elevation & Depth

Nessuna ombra. La profondità è tonale: fondo, superficie e superficie rialzata si distinguono per pochi punti di luminosità e per una hairline da 1px. I dialoghi sono l'unico piano veramente sollevato, e lo dichiarano con un backdrop scuro, non con un'ombra. Il pulsante principale non si solleva: cambia colore e si abbassa di 1px alla pressione.

## Shapes

Angoli morbidi ma non arrotondati per gioco: 8px per le celle, 10px per i controlli, 12px per i pulsanti e le scelte, 16px per i pannelli, 20px per il drawer su desktop e 18px per il foglio mobile. I bordi sono sempre da 1px; le forme completamente tonde sono riservate a barra di avanzamento, indicatori radio e campioni colore. Non ci sono angoli tagliati, clip-path o cornici decorative.

## Components

### Buttons
- **Shape:** rettangolo con angoli da 12px (56px di altezza) per l'azione principale; 10px (44px) per i controlli secondari.
- **Primary:** verde acqua pieno, testo quasi bianco, icona a sinistra, larghezza piena nella scena. Hover: verde profondo e -1px; pressione: torna a 0.
- **Disabled:** fondo rialzato, testo nebbia, bordo hairline; nessuna opacità parziale.
- **Secondary / Ghost:** bordo hairline su fondo trasparente (Impostazioni, Annulla, Fatto). Hover: superficie rialzata e bordo più marcato.
- **Text:** solo testo con icona, per "Ricomincia"; hover su superficie rialzata.

### Choices
- **Style:** schede selezionabili con bordo 1px, fondo rialzato e raggio 12px. La lingua è una griglia 2 × 2; il colore è una riga da tre.
- **State:** selezionata = bordo verde acqua, fondo verde tenue, indicatore a spunta pieno. Il focus arriva sul corpo della scheda, non sull'input nascosto.

### Board cells
- **Style:** rettangoli da 8px, fondo bianco (chiaro) o cella notte (scuro), testo nebbia. Estratto = fondo verde acqua, testo quasi bianco. L'ultimo estratto porta un punto da 4px nell'angolo.
- **State:** l'animazione di estrazione è uno "stamp" di 480ms con scala 0.84 → 1.045 → 1; nessun altro movimento.

### Stage and history
- **Stage:** pannello superficie con titolo, numero enorme, stato e pulsante. Il numero vuoto è uno 0 grigio al 42% di opacità.
- **History:** pannello superficie con chip da 42px; il più recente è verde acqua, gli altri sono hairline. Massimo 12 chip, il resto resta nel tabellone.
- **Progress:** barra da 3px, fondo hairline, riempimento verde acqua; nessun numero sopra.

### Dialogs
- **Drawer:** foglio laterale da 420px su desktop, foglio dal basso su mobile, fondo superficie, bordo hairline, backdrop scuro. Titolo 24px, sezioni con legend 13px, pulsante "Fatto" a tutta larghezza in fondo.
- **Confirm:** dialogo centrato da 420px, titolo 22px, corpo 14.5px, azioni a destra (in colonna inversa su mobile). Il focus iniziale cade su "Annulla".

## Do's and Don'ts

### Do:
- **Do** tenere il numero dell'ultima estrazione come elemento più grande della pagina, con il verde acqua come unico colore di stato.
- **Do** lasciare il tabellone sempre intero e visibile: è il contesto della partita.
- **Do** usare una hairline da 1px e i toni di superficie per separare i pannelli.
- **Do** mantenere il pulsante principale nell'ultima riga della scena, con altezza 56px e larghezza piena.
- **Do** usare cifre tabulari e due cifre nel tabellone (01–90).
- **Do** rispettare `prefers-reduced-motion` eliminando animazioni e transizioni.

### Don't:
- **Don't** aggiungere ombre, gradienti, vetro o bordi spessi: il sistema è piatto.
- **Don't** usare il verde acqua per titoli, sfondi di sezione o decorazioni.
- **Don't** introdurre una seconda famiglia tipografica o testo in maiuscolo spaziato come etichetta.
- **Don't** spostare il tabellone sotto la piega o nasconderlo dietro un tab.
- **Don't** usare il rosso per i numeri, i punteggi o lo stato della partita.
- **Don't** trasformare la cronologia in una lista lunga: dodici chip sono il limite.
