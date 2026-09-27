# 📋 Taskly — Issue & Feature Tracker

Registro ufficiale delle issue, feature request e standard di piattaforma del task e workflow manager **Taskly**.

---

## 🟢 Issue Attive / In Backlog

### 📌 Issue #PWA-1: Shortcut App Desktop/Mobile con Banner Intelligente a Scomparsa (Android & iOS)
- **Modulo:** `Dashboard > UI/UX & PWA` (Standard suite Taaaac)
- **Priorità:** Alta
- **Stato:** 📝 Pianificata / In Backlog

#### Descrizione
Implementare la funzionalità PWA cross-platform introdotta in Schedly, per consentire al team e ai collaboratori di installare Taskly direttamente sul desktop o sullo smartphone come applicazione autonoma sempre pronta per la consultazione e gestione delle task.

#### Specifiche Tecniche & User Story
1. **Pulsante PWA nella Sidebar:**
   - Voce fissa nella navigazione laterale per installare Taskly su qualsiasi dispositivo.
2. **Banner a Scomparsa per Smartphone/Tablet (Android & iOS):**
   - Rilevamento automatico del dispositivo mobile (`isAndroid || isIos`).
   - Se non già installata in modalità standalone e non dismessa in precedenza (`localStorage.pwa_banner_dismissed`), visualizzazione di un floating banner discreto:
     *"Vuoi installare l'app nel tuo dispositivo per averla comoda sul desktop? Clicca qui per installare"*.
   - Gestione dismiss con pulsante "✕" o "Più tardi".
3. **Flussi di Installazione Integrati:**
   - **Android / Chrome / Edge:** Cattura dell'evento `beforeinstallprompt` con apertura del prompt di sistema.
   - **iOS / Safari:** Modale guidato per l'aggiunta rapida alla schermata Home.
