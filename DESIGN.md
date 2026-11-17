---
name: Bingo
description: Tabellone digitale da tavolo per estrarre i 90 numeri del bingo
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
  pine-night: "#0c1711"
  pine-surface: "#122118"
  pine-raised: "#1a2c20"
  cream-ink: "#f4eddc"
  pine-mist: "#b7bea9"
  tree-gold: "#e8c375"
  stage-gold: "#f0cc7a"
  santa-red: "#c7352c"
  beige-paper: "#f1e8d8"
  beige-surface: "#faf3e6"
  pine-ink: "#1f3128"
  beige-muted: "#5d6b5e"
  holly-red: "#b3261e"
  burgundy-night: "#1b0c0d"
  burgundy-surface: "#291214"
  burgundy-cell: "#2c1417"
  burgundy-ink: "#f8e9d8"
  burgundy-muted: "#c9ada4"
  pine-accent: "#327252"
  mint-stage: "#8fd8ab"
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
  number-name:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.55vw, 22px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
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
  number-name:
    backgroundColor: "transparent"
    textColor: "{colors.slate-ink}"
    typography: "{typography.number-name}"
  drawer:
    backgroundColor: "{colors.green-surface}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.sheet}"
---

# Design System: Bingo

## Overview

**Creative North Star: "Il tavolo di chi chiama"**

La pagina è un tavolo da gioco, non una vetrina. Chi conduce la partita siede davanti, chiama un numero alla volta e deve vedere subito l'ultima estrazione; i giocatori guardano lo stesso schermo da più lontano. Il sistema toglie tutto ciò che non serve a quel gesto: una sola azione primaria, un tabellone sempre intero, un numero grande che prende il centro. Il verde acqua è il segno lasciato sul tavolo; il grigio scuro è il piano su cui si gioca.

L'interfaccia resta piatta: pannelli netti, bordi sottili, nessuna ombra e nessun effetto decorativo. La profondità viene dai tre toni di superficie e dal velo scuro dei dialoghi, non dall'illusione di strati. La tipografia è una sola famiglia, usata per peso e scala: il numero estratto è l'unico elemento che può diventare enorme.

**Key Characteristics:**
- Un accento operativo, usato solo per lo stato del gioco e l'azione principale.
- Il tabellone 10 × 9 è sempre visibile e non si sposta.
- Il numero appena estratto domina la scena; il resto resta quieto.
- Il nome napoletano è una seconda riga, subordinata al numero.
- Il tema Natale è una variante sobria: cambia la palette, non la gerarchia. Le tre varianti festive condividono cappello, neve e stella.
- Superfici piatte separate da hairline, mai da ombre.
- Movimento breve e localizzato: il numero entra, il resto non si muove.

## Colors

Palette ristretta: un verde acqua che lavora, un grigio scuro che tiene il tavolo e due neutri di servizio. Chiaro e scuro non sono inversioni meccaniche: il tema scuro alza l'accento a un mint più luminoso per conservare la stessa gerarchia in penombra. I temi Natale cambiano accento e neutri mantenendo gli stessi ruoli: oro su pino, rosso su crema, pino su bordeaux.

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

### Christmas
I temi Natale sono tre palette complete, non decorazioni applicate sopra un tema esistente. Condividono cappello, neve e stella; cambiano fondo e accento.
- **Natale:** **notte di pino** (#0c1711) come fondo; **superficie di pino** (#122118) e **pino rialzato** (#1a2c20) per pannelli, controlli e celle; **inchiostro crema** (#f4eddc) e **nebbia di pino** (#b7bea9) per i testi. **Oro dell'albero** (#e8c375) come accento operativo e **oro di scena** (#f0cc7a) per il numero estratto.
- **Natale crema** (etichetta «Crema»): **carta beige** (#f1e8d8) come fondo; **superficie crema** (#faf3e6) e **crema rialzata** (#fffaf0) per pannelli, controlli e celle; **inchiostro pino** (#1f3128) e **nebbia beige** (#5d6b5e) per i testi. **Rosso agrifoglio** (#b3261e) come accento operativo, **rosso profondo** (#8f1d17) per l'hover e **rosso di scena** (#a51f17) per il numero estratto. I fiocchi diventano oro spento (#a8823c) al 13%.
- **Natale rosso** (etichetta «Rosso»): **notte bordeaux** (#1b0c0d) come fondo; **superficie bordeaux** (#291214) e **cella bordeaux** (#2c1417); **inchiostro crema** (#f8e9d8) e **nebbia rosata** (#c9ada4) per i testi. **Pino** (#327252) come accento operativo e **menta di scena** (#8fd8ab) per il numero estratto.
- **Rosso di Babbo Natale** (#c7352c): solo nel cappello illustrato dell'intestazione, in tutte e tre le varianti.

### Named Rules
**La regola del segno.** L'accento compare solo dove lo stato è cambiato o dove si compie l'azione: celle estratte, ultimo numero, pulsante principale, avanzamento, focus. Non è mai decorazione, sfondo o titolo.

**La regola del rosso.** Nei temi sistema, chiaro e scuro il rosso esiste solo per l'azione irreversibile. Nel tema Natale crema il rosso è l'accento operativo e riempie pulsante, celle e numero in scena, sempre per stato o azione, mai come decorazione. Negli altri due temi festivi resta confinato al cappello illustrato.

**La regola del Natale.** I temi Natale cambiano accento e neutri, non gerarchia, dimensioni o movimenti. Neve, cappello e stella sono dettagli statici e piccoli: niente animazioni festive. L'accento resta operativo in tutte e tre le varianti: oro su pino, rosso su crema, pino su bordeaux.

## Typography

**Display Font:** Gabarito (con ui-sans-serif, system-ui)
**Body Font:** Gabarito

**Character:** Una sola famiglia geometrica e amichevole, con pesi molto distanti tra loro. Il numero in scena usa il peso 800 e i numeri tabulari; le etichette restano a 600, il testo corrente a 400. Non c'è una seconda voce tipografica.

### Hierarchy
- **Display** (800, `clamp(104px, 9.6vw, 142px)`, 0.78): solo il numero dell'ultima estrazione. È il punto focale assoluto.
- **Name** (700, `clamp(18px, 1.55vw, 22px)`, 1.2, -0.02em): nome tradizionale sotto il numero. Massimo 30ch, centrato su desktop e telefono, allineato a sinistra con il numero su tablet.
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

Angoli morbidi ma non arrotondati per gioco: 8px per le celle, 10px per i controlli, 12px per i pulsanti e le scelte, 16px per i pannelli, 20px per il drawer su desktop e 18px per il foglio mobile. I bordi sono sempre da 1px; le forme completamente tonde sono riservate a barra di avanzamento, indicatori radio, campioni colore e interruttori. Non ci sono angoli tagliati o cornici decorative; l'unico clip-path è la stella a quattro punte dell'ultimo numero nei temi Natale.

## Components

### Buttons
- **Shape:** rettangolo con angoli da 12px (56px di altezza) per l'azione principale; 10px (44px) per i controlli secondari.
- **Primary:** verde acqua pieno, testo quasi bianco, icona a sinistra, larghezza piena nella scena. Hover: verde profondo e -1px; pressione: torna a 0.
- **Disabled:** fondo rialzato, testo nebbia, bordo hairline; nessuna opacità parziale.
- **Secondary / Ghost:** bordo hairline su fondo trasparente (Impostazioni, Annulla, Fatto). Hover: superficie rialzata e bordo più marcato.
- **Text:** solo testo con icona, per "Ricomincia"; hover su superficie rialzata.

### Choices
- **Style:** schede selezionabili con bordo 1px, fondo rialzato e raggio 12px. La lingua è una griglia 2 × 2; il colore è una griglia 3 × 2 che resta tale anche su telefono. Le etichette delle varianti sono di una parola, così tutte le schede hanno la stessa altezza.
- **State:** selezionata = bordo dell'accento, fondo accento tenue, indicatore a spunta pieno. Il focus arriva sul corpo della scheda, non sull'input nascosto.
- **Names toggle:** una riga con testo e interruttore da 44 × 26px; accesa = bordo e fondo accento tenue, pomello nell'inchiostro dell'accento. L'intero blocco è cliccabile.

### Board cells
- **Style:** rettangoli da 8px, fondo bianco (chiaro), cella notte (scuro), cella pino (Natale), crema rialzata (Natale crema) o cella bordeaux (Natale rosso), testo nebbia. Estratto = fondo accento, testo quasi bianco. L'ultimo estratto porta un punto da 4px nell'angolo; nei temi Natale diventa una stella a quattro punte nell'inchiostro dell'accento.
- **State:** l'animazione di estrazione è uno "stamp" di 480ms con scala 0.84 → 1.045 → 1; nessun altro movimento.

### Stage and history
- **Stage:** pannello superficie con titolo, numero enorme, nome opzionale, stato e pulsante. Il numero vuoto è uno 0 grigio al 42% di opacità.
- **Names:** quando l'interruttore è acceso, il nome tradizionale compare sotto il numero, centrato e in inchiostro pieno. Lo stesso nome alimenta `title` e `aria-label` di celle e chip, e l'annuncio della live region.
- **History:** pannello superficie con chip da 42px; il più recente è accento, gli altri sono hairline. Massimo 12 chip, il resto resta nel tabellone.

### Christmas details
- **Hat:** un SVG da 22 × 19px appoggiato in alto a destra sul marchio nell'intestazione, visibile in tutte le varianti di Natale. Rosso con un profilo avorio che lo stacca dal marchio, fermo, `aria-hidden`.
- **Snow:** due fiocchi SVG statici nel fondo della pagina, uno per angolo: crema al 7% sui fondi scuri, oro spento al 13% sul fondo beige. Non coprono pannelli né testo e non si animano.
- **Star:** la stella a quattro punte nell'angolo della cella più recente usa l'inchiostro dell'accento: scura sull'oro, crema sul rosso e sul pino. Resta un dettaglio, mai un secondo accento.
- **Swatch:** ogni variante ha il suo campione nel selettore: pino/oro, beige/rosso, bordeaux/menta. Il tema si riconosce prima di applicarlo.
- **Progress:** barra da 3px, fondo hairline, riempimento verde acqua; nessun numero sopra.

### Dialogs
- **Drawer:** foglio laterale da 420px su desktop, foglio dal basso su mobile, fondo superficie, bordo hairline, backdrop scuro. Titolo 24px, sezioni con legend 13px, pulsante "Fatto" a tutta larghezza in fondo. Su mobile il piè di pagina resta agganciato al fondo mentre il contenuto scorre.
- **Confirm:** dialogo centrato da 420px, titolo 22px, corpo 14.5px, azioni a destra (in colonna inversa su mobile). Il focus iniziale cade su "Annulla".

## Do's and Don'ts

### Do:
- **Do** tenere il numero dell'ultima estrazione come elemento più grande della pagina, con il verde acqua come unico colore di stato.
- **Do** lasciare il tabellone sempre intero e visibile: è il contesto della partita.
- **Do** usare una hairline da 1px e i toni di superficie per separare i pannelli.
- **Do** mantenere il pulsante principale nell'ultima riga della scena, con altezza 56px e larghezza piena.
- **Do** usare cifre tabulari e due cifre nel tabellone (01–90).
- **Do** mostrare il nome napoletano come seconda riga, più piccola del numero e più grande dello stato.
- **Do** tenere i dettagli natalizi piccoli, statici e fuori dal contenuto informativo.
- **Do** rispettare `prefers-reduced-motion` eliminando animazioni e transizioni.

### Don't:
- **Don't** aggiungere ombre, gradienti, vetro o bordi spessi: il sistema è piatto.
- **Don't** usare il verde acqua per titoli, sfondi di sezione o decorazioni.
- **Don't** introdurre una seconda famiglia tipografica o testo in maiuscolo spaziato come etichetta.
- **Don't** spostare il tabellone sotto la piega o nasconderlo dietro un tab.
- **Don't** usare il rosso per i numeri, i punteggi o lo stato della partita. Nel tema Natale crema il rosso è l'accento operativo e si usa solo come tale; negli altri temi resta confinato al cappello illustrato.
- **Don't** animare la neve, far cadere coriandoli o aggiungere suoni natalizi.
- **Don't** trasformare la cronologia in una lista lunga: dodici chip sono il limite.
