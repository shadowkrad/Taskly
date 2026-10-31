# 🚀 Taskly — Release Notes

## Novità della Versione 1.1.0 (In Sviluppo)

### 1. 💬 Integrazione WhatsApp a 360° (Smart Link Gratuito & Connessione Taaaac Hub)
- **Floating WhatsApp Widget sulla Vetrina Ditta / Assistenza**: Aggiunto il pulsante galleggiante WhatsApp ufficiale in basso a destra su tutte le pagine pubbliche (FloatingWhatsAppWidget), per consentire a privati e aziende di richiedere pronto intervento o preventivi via chat.
- **Perfezionamento Grafico Bollino WhatsApp Ufficiale**: integrato il tracciato vettoriale ufficiale Meta WhatsApp (fumetto solido bianco puro #FFFFFF ad alta definizione con cornetta verde #25D366 in risalto), eliminando il vecchio bordo vuoto wireframe e garantendo la massima nitidezza visiva su tutti i dispositivi.
- **Pulsante WhatsApp 1-Click su Ticket & Interventi**: Nella dashboard operativa interventi, aggiunto il pulsante verde WhatsApp accanto al tasto di chiamata rapida. Con 1 click compone il messaggio con i dettagli dell'intervento (titolo, orario programmato e azienda) aprendo la chat istantaneamente a costo 0 €.
- **Client Standardizzato (@/lib/whatsapp-client & @/lib/whatsapp-server)**: Connessione al micro-servizio centralizzato di Taaaac Core per le notifiche cloud.

### 2. 🌐 Hub Sincronizzazione Omnicanale (Google Maps, Meta Facebook & IG, WhatsApp Business)
- **Aggiornamento Orari Operativi & Reperibilità H24 All'Unisono con 1 Click**: Dalla scheda *Dashboard > Impostazioni > Reperibilità & Tariffe*, il pulsante 🚀 Salva e Sincronizza Reperibilità su Google & Canali aggiorna simultaneamente la scheda Google Business Profile (Maps & Ricerca), le Pagine Meta (Facebook & Instagram) e il profilo WhatsApp Business della ditta.
- **Badge di Stato Canali in Tempo Reale**: Nuova scheda visiva nella gestione reperibilità con indicatori live dello stato di connessione e sincronizzazione per Google Maps, Meta, WhatsApp Business e Google Review Booster.
- **Architettura Centralizzata Taaaac Core**: Gestione centralizzata e sicura di tutti i token di accesso e delle API dei canali esterni tramite Taaaac Core.

### 3. ⭐ Google Review Booster Automatico via Email (5 Stelle Intelligenti)
- **Email Post-Intervento Automatica a Costo Zero**: Quando un intervento tecnico viene segnato come COMPLETATO o viene emesso il rapportino digitale di lavoro, il sistema invia in automatico un'email con 5 stelle interattive da 
oreply@taaaac.eu senza consumare la quota messaggi WhatsApp.
- **Routing Intelligente Reputazione**:
  - **4 e 5 Stelle (Lavoro Impeccabile)**: Reindirizzano il cliente direttamente alla scheda Google Maps per pubblicare la recensione a 5 stelle verificata.
  - **1, 2 e 3 Stelle (Customer Care)**: Reindirizzano al modulo di feedback privato interno (/feedback) permettendo alla ditta di ricontattare il cliente e risolvere ogni dubbio tempestivamente.

## Novità della Versione 1.0.8 (Hotfix / Patch)

### 1. 🔧 Vetrina Impianti 100% Personalizzabile & Live Studio Completo
- **Pannello Orari & Sede nello Studio Vetrina**: Gestione completa di claim aziendale, testo garanzia RC, orari reperibilità, turni H24, sede operativa e recapiti telefonici/email.
- **Footer Dinamico (`PublicFooter.tsx`)**: Sostituiti tutti i testi statici; la vetrina pubblica rispecchia ora fedelmente le informazioni configurate dall'azienda.
- **Anteprima Live Studio Aggiornata**: Preview in tempo reale di tutte le modifiche apportate alla scheda dell'attività.

### 2. 🎨 Pulizia Estetica Navbar: Rimozione Badge Invasivi
- **Intestazione Minimale & Logo Protagonista**: Rimosso il micro-badge fisso "PRO" accanto al nome dell'attività sia nella barra di navigazione pubblica sia nella pagina di accesso, rendendo l'identità dell'azienda pulita, sobria e senza sovrapposizioni grafiche.

---

## Novità della Versione 1.0.7 (Hotfix / Patch)

### 1. 🔐 Autenticazione Distinta: Email + Password Titolare & PIN Staff Cantiere
- **Accesso Titolare Diretto con Email e Password**: Il titolare dell'impresa/studio accede inserendo l'indirizzo email e la password ricevuti al momento della registrazione o aggiornati nel proprio account Taaaac, eliminando la richiesta confusa del solo PIN/Password generica.
- **PIN Tastierino Touch Dedicato ai Collaboratori**: Il tastierino numerico PIN rapido è ora dedicato esclusivamente ai tecnici e collaboratori operativi per sbloccare rapidamente i tablet e le postazioni in cantiere o in mobilità.
- **Centralizzazione Sicurezza e MFA su Taaaac Core**: Le impostazioni avanzate di sicurezza (2FA TOTP, codici di recupero, cambio password) sono centralizzate al 100% nella dashboard utente di Taaaac (taaaac.eu/portal), semplificando l'esperienza all'interno del modulo satellite.

---
## Novità della Versione 1.0.6 (Patch di Sicurezza e Hardening Accessi)

### 1. 🛡️ Autenticazione a Due Fattori (2FA / MFA Volontaria con Codici di Emergenza)
- **Supporto TOTP Universale**: Ogni artigiano, tecnico o titolare può abilitare liberamente l'autenticazione a due fattori scansionando il QR code con qualsiasi app Authenticator standard (Google Authenticator, Microsoft Authenticator, Apple Passwords, 1Password, Bitwarden).
- **8 Codici di Recupero di Emergenza**: Generazione di codici di backup monouso crittografati nel database, da conservare per accedere qualora lo smartphone non fosse momentaneamente disponibile.
- **Login Dinamico a 2 Step**: Interfaccia di accesso con verifica delle credenziali e passaggio immediato all'inserimento del codice a 6 cifre o di emergenza.

### 2. 📧 Allerta Immediata per Accesso da Nuovo Dispositivo
- **Riconoscimento Automatico Dispositivi**: Rilevamento di browser, sistema operativo e indirizzo IP ad ogni login.
- **Email di Sicurezza Automatica**: Al primo accesso da un nuovo computer o smartphone, il sistema invia un'email di avviso con data, ora, dispositivo e indirizzo IP, per la massima tranquillità.

### 3. 📋 Centro di Controllo Sicurezza, Registro Accessi e Disconnessione Remota
- **Pannello "Sicurezza & 2FA" in Dashboard**: Accessibile direttamente dalla barra laterale della dashboard per verificare i dispositivi registrati e la cronologia degli accessi con esito dettagliato.
- **Disconnessione Remota Globale (Kill-Switch)**: Possibilità di revocare all'istante l'accesso da tutti i dispositivi remoti con un singolo clic.

### 4. 🛑 Protezione Anti Brute-Force e Honey-Pot Anti-Bot
- **Blocco Temporaneo Automatico**: Protezione attiva contro tentativi di indovinare la password; dopo 5 tentativi consecutivi errati dall'IP o sull'account, l'accesso viene sospeso per 15 minuti con timer di sblocco in tempo reale.
- **Honey-Pot Silenzioso**: Campo esca invisibile nel modulo di login che respinge all'istante bot automatizzati prima dell'elaborazione.

### 5. 🎄 Calendario Festività Nazionali, Reperibilità Straordinaria & Preavviso a 7 Giorni
- **Motore Festività Nazionali Italiane con Calcolo Pasqua**: Riconoscimento automatico delle 12 festività ufficiali italiane (Natale, Capodanno, Epifania, Pasqua, Lunedì dell'Angelo, 25 Aprile, 1 Maggio, 2 Giugno, Ferragosto, Tutti i Santi, Immacolata, Santo Stefano) tramite algoritmo astronomico di Meeus/Jones/Butcher.
- **Nuovo Pannello "Orari & Festività" in Dashboard**: Gestione unificata degli orari della squadra tecnica (interventi ordinari, reperibilità sabato/domenica) e delle date speciali (chiusure per ferie estive o turni straordinari di pronto intervento festivo a tariffa maggiorata).
- **Banner Intelligente di Preavviso (7 Giorni di Anticipo)**: Notifica proattiva nella panoramica interventi della dashboard con 7 giorni di anticipo sull'arrivo di ogni festività, per pianificare tempestivamente i turni dei tecnici e confermare lo stato del servizio.

---

## Novità della Versione 1.0.5 (Hotfix Produzione)

### 1. 📱 Fix Icone PWA per Smartphone (iOS & Android) & Supporto Favicon Personalizzata
- **Risoluzione Icone Vuote o Fallback su Mobile**: Risolto il problema per cui su iPhone e dispositivi Android le icone PWA apparivano come quadrati monocromatici vuoti o lettere di ripiego. iOS Safari richiede rigorosamente formati PNG raster per `apple-touch-icon`, scartando i file vettoriali SVG.
- **Logica Intelligente di Fallback**:
  - Se il cliente/tenant ha caricato un proprio logo o favicon personalizzato nelle impostazioni di brand, la PWA su smartphone adotta automaticamente l'immagine del cliente.
  - Se il cliente non ha configurato una favicon, il sistema inietta l'icona ufficiale nativa in alta risoluzione (Cartellina task con badge checkmark verde 3D su Oceanic Sky Blue) con formati specifici (`apple-touch-icon.png` a 180x180 per Apple, `icon-192.png`, `icon-512.png` e `icon-maskable-512.png` per Android).
- **Allineamento Universale Manifest**: Serviti contemporaneamente sia `/manifest.json` sia `/manifest.webmanifest` con MIME type standard e categorie W3C PWA valide.

### 2. 🧭 Fix Navigazione Menu Impostazioni su Smartphone & PWA (Risoluzione Schermata Singola)
- **Risoluzione Blocco Prima Pagina**: Risolto il problema per cui su smartphone e display mobile i pulsanti delle impostazioni occupavano il 100% della larghezza orizzontale nascondendo le altre sezioni e impedendo l'accesso alle schede successive (Reperibilità & Tariffe, Email, WhatsApp, Dispositivi, Aspetto).
- **Nuovo Selettore Nativo Mobile**: Introdotto un menu a tendina rapido nativo su smartphone (< lg) ancorato stabilmente sotto l'header (sticky). Consente di selezionare ed esplorare istantaneamente qualsiasi sezione con 1 tap, sfruttando il picker nativo di iOS e Android. Su desktop la barra di navigazione verticale completa rimane intatta.

### 3. 🔐 Autenticazione Master Qualificata & Accesso Rapido Passkey Biometrica
- **Rimozione Completa Credenziali in Chiaro**: Eliminati tutti i testi e hint con credenziali di default o email/password di test esposti nell'interfaccia di login dei tenant reali.
- **Supporto Password Master Semplificata**: Accesso gestionale rapido e sicuro con la password master impostata all'attivazione del tenant su Taaaac (con toggle visibilità password) ed email facoltativa.
- **Accesso 1-Click su Ambiente Demo (Vercel)**: Nei canali di prova e demo pubblica, pulsante dedicato ad accesso immediato senza digitazione di credenziali.
- **Sblocco Istantaneo con Passkey Biometrica**: Accesso in 1 secondo via impronta digitale, Face ID o PIN nativo del dispositivo (WebAuthn) per i dispositivi registrati in *Impostazioni > Dispositivi PWA*.

### 4. 📲 Guida Rapida per il Cliente: Come Aggiornare l'Icona sul Tuo Smartphone
> **⚠️ Nota Tecnica Importante sulla Cache dei Telefoni:**
> I sistemi operativi mobili (Apple iOS e Android) memorizzano l'icona dell'applicazione nella cache locale permanente al momento del primo salvataggio sulla schermata Home. Pertanto, **le app già aggiunte in precedenza continueranno a mostrare la vecchia icona finché non vengono registrate nuovamente**.

#### 🛠️ Istruzioni Passo-Passo per Sostituire la Vecchia Icona (30 secondi):
1. **Elimina la vecchia icona dalla schermata Home**:
   - Tieni premuto il dito sull'icona attuale dell'app sullo schermo del telefono fino a quando compare il menu a comparsa, quindi tocca **"Rimuovi app"** (oppure **"Elimina dalla schermata Home"**).
2. **Apri il tuo gestionale nel browser**:
   - Apri il browser dello smartphone (**Safari** su iPhone/iPad oppure **Chrome** su Android) e collegati all'indirizzo del tuo sito web.
3. **Aggiungi nuovamente l'app alla schermata Home**:
   - **Su iPhone (iOS / Safari)**: tocca l'icona di condivisione in basso al centro (il quadrato con la freccia verso l'alto ⬆️), scorri il menu verso il basso e tocca **"Aggiungi alla schermata Home"**, quindi conferma con **"Aggiungi"** in alto a destra.
   - **Su Android (Chrome)**: tocca il menu con i tre puntini in alto a destra (⋮), seleziona **"Aggiungi a schermata Home"** (o **"Installa applicazione"**), e conferma con **"Aggiungi"**.
4. **Fatto!** L'icona sulla schermata Home del tuo smartphone sarà ora perfettamente nitida, con la grafica dedicata o con il logo del tuo brand.

---

## Novità della Versione 1.1.0 (In Sviluppo)

### 1. 💬 Integrazione WhatsApp a 360° (Smart Link Gratuito & Connessione Taaaac Hub)
- **Floating WhatsApp Widget sulla Vetrina Ditta / Assistenza**: Aggiunto il pulsante galleggiante WhatsApp ufficiale in basso a destra su tutte le pagine pubbliche (`FloatingWhatsAppWidget`), per consentire a privati e aziende di richiedere pronto intervento o preventivi via chat.
- **Perfezionamento Grafico Bollino WhatsApp Ufficiale**: integrato il tracciato vettoriale ufficiale Meta WhatsApp (fumetto solido bianco puro `#FFFFFF` ad alta definizione con cornetta verde `#25D366` in risalto), eliminando il vecchio bordo vuoto wireframe e garantendo la massima nitidezza visiva su tutti i dispositivi.
- **Pulsante WhatsApp 1-Click su Ticket & Interventi**: Nella dashboard operativa interventi, aggiunto il pulsante verde `WhatsApp` accanto al tasto di chiamata rapida. Con 1 click compone il messaggio con i dettagli dell'intervento (titolo, orario programmato e azienda) aprendo la chat istantaneamente a costo 0 €.
- **Client Standardizzato (`@/lib/whatsapp-client` & `@/lib/whatsapp-server`)**: Connessione al micro-servizio centralizzato di Taaaac Core per le notifiche cloud.

### 2. 🌐 Hub Sincronizzazione Omnicanale (Google Maps, Meta Facebook & IG, WhatsApp Business)
- **Aggiornamento Orari Operativi & Reperibilità H24 All'Unisono con 1 Click**: Dalla scheda *Dashboard > Impostazioni > Reperibilità & Tariffe*, il pulsante `🚀 Salva e Sincronizza Reperibilità su Google & Canali` aggiorna simultaneamente la scheda Google Business Profile (Maps & Ricerca), le Pagine Meta (Facebook & Instagram) e il profilo WhatsApp Business della ditta.
- **Badge di Stato Canali in Tempo Reale**: Nuova scheda visiva nella gestione reperibilità con indicatori live dello stato di connessione e sincronizzazione per Google Maps, Meta, WhatsApp Business e Google Review Booster.
- **Architettura Centralizzata Taaaac Core**: Gestione centralizzata e sicura di tutti i token di accesso e delle API dei canali esterni tramite Taaaac Core.

### 3. ⭐ Google Review Booster Automatico via Email (5 Stelle Intelligenti)
- **Email Post-Intervento Automatica a Costo Zero**: Quando un intervento tecnico viene segnato come `COMPLETATO` o viene emesso il rapportino digitale di lavoro, il sistema invia in automatico un'email con 5 stelle interattive da `noreply@taaaac.eu` senza consumare la quota messaggi WhatsApp.
- **Routing Intelligente Reputazione**:
  - **4 e 5 Stelle (Lavoro Impeccabile)**: Reindirizzano il cliente direttamente alla scheda Google Maps per pubblicare la recensione a 5 stelle verificata.
  - **1, 2 e 3 Stelle (Customer Care)**: Reindirizzano al modulo di feedback privato interno (`/feedback`) permettendo alla ditta di ricontattare il cliente e risolvere ogni dubbio tempestivamente.

---

## Novità della Versione 1.0.5 (Hotfix / Patch)

### 1. 📱 Fix Icone PWA per Smartphone (iOS & Android) & Supporto Favicon Personalizzata
- **Risoluzione Icone Vuote o Fallback su Mobile**: Risolto il problema per cui su iPhone e dispositivi Android le icone PWA apparivano come quadrati monocromatici vuoti o lettere di ripiego. iOS Safari richiede rigorosamente formati PNG raster per `apple-touch-icon`, scartando i file vettoriali SVG.
- **Logica Intelligente di Fallback**:
  - Se il cliente/tenant ha caricato un proprio logo o favicon personalizzato nelle impostazioni di brand (*Dashboard > Impostazioni > Aspetto & Brand*), la PWA su smartphone adotta automaticamente l'immagine del cliente.
  - Se il cliente non ha configurato una favicon, il sistema inietta l'icona ufficiale nativa in alta risoluzione (Cartellina task con badge checkmark verde 3D su Oceanic Sky Blue) con formati specifici (`apple-touch-icon.png` a 180x180 per Apple, `icon-192.png`, `icon-512.png` e `icon-maskable-512.png` per Android).
- **Allineamento Universale Manifest**: Serviti contemporaneamente sia `/manifest.json` sia `/manifest.webmanifest` con MIME type standard e categorie W3C PWA valide.

### 2. 🧭 Fix Navigazione Menu Impostazioni su Smartphone & PWA (Risoluzione Schermata Singola)
- **Risoluzione Blocco Prima Pagina**: Risolto il problema per cui su smartphone e display mobile i pulsanti delle impostazioni occupavano il 100% della larghezza orizzontale nascondendo le altre sezioni e impedendo l'accesso alle schede successive (Reperibilità & Tariffe, Email, WhatsApp, Dispositivi, Aspetto).
- **Nuovo Selettore Nativo Mobile**: Introdotto un menu a tendina rapido nativo su smartphone (< lg) ancorato stabilmente sotto l'header (sticky). Consente di selezionare ed esplorare istantaneamente qualsiasi sezione con 1 tap, sfruttando il picker nativo di iOS e Android. Su desktop la barra di navigazione verticale completa rimane intatta.

### 3. 🔐 Autenticazione Master Qualificata & Accesso Rapido Passkey Biometrica
- **Rimozione Completa Credenziali in Chiaro**: Eliminati tutti i testi e hint con credenziali di default o email/password di test esposti nell'interfaccia di login dei tenant reali.
- **Supporto Password Master Semplificata**: Accesso gestionale rapido e sicuro con la password master impostata all'attivazione del tenant su Taaaac (con toggle visibilità password) ed email facoltativa.
- **Accesso 1-Click su Ambiente Demo (Vercel)**: Nei canali di prova e demo pubblica, pulsante dedicato ad accesso immediato senza digitazione di credenziali.
- **Sblocco Istantaneo con Passkey Biometrica**: Accesso in 1 secondo via impronta digitale, Face ID o PIN nativo del dispositivo (WebAuthn) per i dispositivi registrati in *Impostazioni > Dispositivi PWA*.

### 4. 📲 Guida Rapida per il Cliente: Come Aggiornare l'Icona sul Tuo Smartphone
> **⚠️ Nota Tecnica Importante sulla Cache dei Telefoni:**
> I sistemi operativi mobili (Apple iOS e Android) memorizzano l'icona dell'applicazione nella cache locale permanente al momento del primo salvataggio sulla schermata Home. Pertanto, **le app già aggiunte in precedenza continueranno a mostrare la vecchia icona finché non vengono registrate nuovamente**.

#### 🛠️ Istruzioni Passo-Passo per Sostituire la Vecchia Icona (30 secondi):
1. **Elimina la vecchia icona dalla schermata Home**:
   - Tieni premuto il dito sull'icona attuale dell'app sullo schermo del telefono fino a quando compare il menu a comparsa, quindi tocca **"Rimuovi app"** (oppure **"Elimina dalla schermata Home"**).
2. **Apri il tuo gestionale nel browser**:
   - Apri il browser dello smartphone (**Safari** su iPhone/iPad oppure **Chrome** su Android) e collegati all'indirizzo del tuo sito web.
3. **Aggiungi nuovamente l'app alla schermata Home**:
   - **Su iPhone (iOS / Safari)**: tocca l'icona di condivisione in basso al centro (il quadrato con la freccia verso l'alto ⬆️), scorri il menu verso il basso e tocca **"Aggiungi alla schermata Home"**, quindi conferma con **"Aggiungi"** in alto a destra.
   - **Su Android (Chrome)**: tocca il menu con i tre puntini in alto a destra (⋮), seleziona **"Aggiungi a schermata Home"** (o **"Installa applicazione"**), e conferma con **"Aggiungi"**.
4. **Fatto!** L'icona sulla schermata Home del tuo smartphone sarà ora perfettamente nitida, con la grafica dedicata o con il logo del tuo brand.

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