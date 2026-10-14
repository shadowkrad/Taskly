# 🔧 Taskly — Release Notes

## Novità della Versione 1.1.0 (In Sviluppo)

### 1. 📱 Fix Icone PWA per Smartphone (iOS & Android) & Supporto Favicon Personalizzata
- **Risoluzione Icone Vuote o Fallback su Mobile**: Risolto il problema per cui su iPhone e dispositivi Android le icone PWA apparivano come quadrati monocromatici vuoti o lettere di ripiego. iOS Safari richiede rigorosamente formati PNG raster per `apple-touch-icon`, scartando i file vettoriali SVG.
- **Logica Intelligente di Fallback**:
  - Se il cliente/tenant ha caricato un proprio logo o favicon personalizzato nelle impostazioni di brand, la PWA su smartphone adotta automaticamente l'immagine del cliente.
  - Se il cliente non ha configurato una favicon, il sistema inietta l'icona ufficiale nativa in alta risoluzione (Cartellina task con badge checkmark verde 3D su Oceanic Sky Blue) con formati specifici (`apple-touch-icon.png` a 180x180 per Apple, `icon-192.png`, `icon-512.png` e `icon-maskable-512.png` per Android).
- **Allineamento Universale Manifest**: Serviti contemporaneamente sia `/manifest.json` sia `/manifest.webmanifest` con MIME type standard e categorie W3C PWA valide.

---

### 1. 💬 Integrazione WhatsApp a 360° (Smart Link Gratuito & Connessione Taaaac Hub)
- **Floating WhatsApp Widget sulla Vetrina Ditta / Assistenza**: Aggiunto il pulsante galleggiante WhatsApp ufficiale in basso a destra su tutte le pagine pubbliche (`FloatingWhatsAppWidget`), per consentire a privati e aziende di richiedere pronto intervento o preventivi via chat.
- **Pulsante WhatsApp 1-Click su Ticket & Interventi**: Nella dashboard operativa interventi, aggiunto il pulsante verde `WhatsApp` accanto al tasto di chiamata rapida. Con 1 click compone il messaggio con i dettagli dell'intervento (titolo, orario programmato e azienda) aprendo la chat istantaneamente a costo 0 €.
- **Client Standardizzato (`@/lib/whatsapp-client` & `@/lib/whatsapp-server`)**: Connessione al micro-servizio centralizzato di Taaaac Core per le notifiche cloud.

---

## Novità della Versione 1.0.4

### 1. 📅 Calendario Interventi & Cantieri Mobile
- **Timeline Lavori Giornaliera & Settimanale**: Pianificazione interventi con indicazione chiara di luogo, cliente e durata stimata.
- **Visualizzazione Touch per Tecnici**: Interfaccia ultra-reattiva studiata per l'uso su smartphone e tablet direttamente in cantiere o furgone.

### 2. 📝 Schede Lavoro & Rapportini
- **Stato Avanzamento Lavori**: Aggiornamento immediato dello stato dell'intervento (Pianificato, In Corso, Completato, Fatturato).
- **Note Tecniche & Materiali**: Annotazione rapida dei dettagli dell'intervento e dei materiali impiegati.

### 3. ⚡ Stabilità & Notifiche
- **Sincronizzazione Cloud Istantanea**: Dati sincronizzati in tempo reale tra ufficio e operatori sul campo.

---

## Novità della Versione 1.0.3

### 1. 🖼️ Sistema Brand & Vetrina Adattiva (Zero Deformazioni)
Standardizzazione completa degli asset grafici per l'Azienda / Ditta con salvataggio, compressione automatica client-side WebP e proporzioni perfette su qualsiasi dispositivo:
- **Logo Navbar, Header & Intestazione Rapportini (`logoUrl`)**:
  - **Dimensione consigliata**: `400 × 100 px` (aspect ratio 4:1 o 3:1).
  - **Vincoli & Rendering**: altezza massima bloccata a 80 px con proprietà CSS `object-contain`, garantendo la massima nitidezza sia su dispositivi mobili dei tecnici che su schermi desktop e stampe PDF dei rapportini senza distorsioni.
  - **Formato raccomandato**: PNG con sfondo trasparente o SVG vettoriale.
- **Favicon Browser Ultra-Visibile (`faviconUrl`)**:
  - **Dimensione consigliata**: `128 × 128 px` o `256 × 256 px` (rapporto 1:1 quadrato).
  - **Resa grafica**: sagoma ad alto contrasto con margine di sicurezza per renderla immediatamente distinguibile a 16×16 px sulla linguetta del browser sia in Dark Mode che in Light Mode. Funge da icona ufficiale per la PWA installata su smartphone e tablet dei tecnici sul campo.
- **Logo Insegna / Banner Principale Hero (`logoHeroUrl` + `mostraLogoInHero`)**:
  - Possibilità di sostituire il testo del nome aziendale con un'insegna grafica o marchio sopra alla vetrina di richiesta intervento.
  - **Dimensione consigliata**: `800 × 240 px` (insegna orizzontale) oppure `400 × 400 px` (stemmi aziendali o loghi tondi).
  - **Adattamento fluido**: auto-scale fino all'85vw su mobile e massimo 480 px su desktop con proporzioni protette. Fallback automatico sul logo navbar in assenza di insegna separata.
- **Immagine Copertina Vetrina (Hero Background) (`fotoHeroUrl`)**:
  - **Dimensione consigliata**: `1920 × 800 px` (panoramica 16:9 / 21:9).
  - **Formato raccomandato**: JPG o WebP compresso (peso massimo 2 MB).
  - **Resa grafica**: sfondo panoramico a tutto schermo (es. flotta mezzi, cantiere, officina o interventi) arricchito da un filtro overlay sfumato scuro antiriflesso (`bg-gradient-to-t` da nero/60% a nero/30%), per garantire il massimo contrasto per recapiti di reperibilità H24, bottoni di chiamata rapida e insegna aziendale.

### 2. 🏷️ Esperienza 100% White-Label (Nessun Riferimento al Modulo)
- **Titolo scheda browser dinamico (`generateMetadata`)**: visualizzazione esclusiva di `{Nome Ditta} — {Settore / Reperibilità}` nel portale pubblico, eliminando ogni traccia del nome gestionale o piattaforma.
- **Sottopagine con template coerente**: `{Titolo Intervento / Pagina} | {Nome Ditta}` per un'esperienza totalmente brandizzata per i clienti.
- **Footer e interfacce clienti pulite**: rimozione totale di diciture tecniche esterne. Footer con copyright istituzionale `© 2026 {Nome Ditta}. Tutti i diritti riservati.`
- **Accesso Staff & Tecnici**: etichetta neutrale e professionale `"Area Riservata Staff"`.

### 3. 🎨 Motore Colori Brand Dinamici & Caricamento Drag & Drop
- Sincronizzazione in tempo reale del colore Primario e di Accento direttamente applicati su bottoni di richiesta assistenza, badge di priorità intervento e dettagli dei rapportini.
- Pannello impostazioni ditta aggiornato con caricamento drag & drop fino a 16 MB con compressione WebP e badge con dimensioni ottimali suggerite.

---

## Novità della Versione 1.0.2

### 1. 🎨 Personalizzazione Brand: Logo Ditta & Favicon Portale
- Possibilità di caricare il logo aziendale da *Dashboard > Impostazioni > Aspetto & Brand* con compressione automatica WebP per intestazione rapportini e portale clienti.
- Favicon 128x128 personalizzata per tab del browser e icona PWA installata su smartphone e tablet dei tecnici.
- Anteprima live di visualizzazione prima del salvataggio.

### 2. ⚙️ Impostazioni Moderne a 2 Colonne (Stile Stripe)
- Sezione impostazioni riorganizzata con interfaccia moderna a due colonne, icone Lucide e raggruppamento per aree operative.
- Configurazione avanzata reperibilità H24, tariffe orarie, diritto di chiamata e canali di notifica ticket d'intervento.

### 3. 📲 Accesso Biometrico PWA & Gestione Dispositivi (WebAuthn)
- Login con impronta digitale o Face ID per tecnici in mobilità e sul cantiere.
- Monitoraggio dei device registrati con disconnessione remota rapida di smartphone o tablet smarriti.
