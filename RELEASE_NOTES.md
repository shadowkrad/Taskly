# 🔧 Taskly — Release Notes v1.0.1

## Novità della Versione 1.0.1

### 1. 📲 Shortcut App per Smartphone e Tablet Cantiere (PWA)
- Aggiunta la voce *"📲 Installa App · Aggiungi a Home / Desktop"* nel menu laterale (`☰`), senza banner invasivi sulla lista interventi.
- Modale guidato a schermo intero (`createPortal` su `document.body`, `z-[9999]`) con istruzioni dedicate per iOS Safari, prompt 1-click per Android e scorciatoia per browser Desktop.

### 2. ⚙️ Impostazioni Modulari a 5 Schede
- Riorganizzazione della sezione `/dashboard/impostazioni` con navigazione a schede:
  - 🏢 **Attività & Sede**: Ragione sociale ditta, P.IVA, responsabile tecnico, magazzino e recapiti;
  - ⏰ **Reperibilità & Tariffe**: Pronto intervento H24, diritto di chiamata fisso, tariffa oraria standard e festiva/notturna;
  - 📧 **Email & Notifiche**: Casella Taaaac Mail Engine e notifiche ticket;
  - 💬 **WhatsApp & Urgenze**: Notifiche automatiche di assegnazione guasto e arrivo tecnico;
  - 🎨 **Aspetto & Brand**: Logo aziendale, tema indaco e intestazione rapportino di lavoro.
