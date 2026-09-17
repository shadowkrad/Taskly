# Taskly • Taaaac Modular Ecosystem

Applicativo verticale indipendente per la gestione operativa di task e progetti, sviluppato per integrarsi nativamente nella console centrale **Taaaac Core** (https://taaaac.eu).

Gestito da **Alessio Guidelli** (GitHub: [shadowkrad](https://github.com/shadowkrad)).

---

## 🎯 Architettura & Ruolo

- **Applicativo Indipendente**: Ospitato nel repository shadowkrad/taskly.
- **Database Isolato**: SQLite con Prisma ORM, isolato per ogni singolo tenant/cliente (dev.db).
- **Integrazione Taaaac Core**: Consuma l'API runtime GET https://taaaac.eu/api/public/tenant-config?domain=[domain]&token=[token] per:
  1. Validazione stato licenza (ATTIVO, SOSPESO, IN_SCADENZA).
  2. Moduli Add-on abilitati (es. WHATSAPP_REMINDERS, TASKLY_AUTOMATIONS, ADVANCED_REPORTS).
  3. Personalizzazione dinamica del brand (palette colori CSS variabili, nome brand, logo).

---

## 🎨 Taaaac Design System

- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Prisma.
- **Sfondo neutro elegante**: g-slate-50.
- **Card & Container**: card-taaaac (g-white border border-slate-200/90 rounded-2xl p-5 shadow-xs).
- **Pulsanti & Interazioni**: tn-taaaac (ounded-xl font-semibold transition-all cursor-pointer).
- **Palette dinamica**: Variabili semantiche CSS (--color-brand-primary, --color-brand-accent) per il tema del brand del cliente.

---

## 🚀 Primi Passi & Sviluppo Locale

### 1. Installazione Dipendenze
`ash
npm install
`

### 2. Configurazione Ambiente
Copia il file .env.example in .env:
`ash
cp .env.example .env
`

### 3. Setup Database SQLite
`ash
npm run db:push
`

### 4. Avvio Server di Sviluppo
`ash
npm run dev
`
L'app sarà raggiungibile su [http://localhost:3000](http://localhost:3000).

---

## 🚢 Distribuzione & Deployment

### Vercel (Branch cliente-demo)
Per le anteprime live e le demo clienti:
`ash
git checkout cliente-demo
git push origin cliente-demo
`

### Container Docker su VPS Aruba con Traefik SSL
Il progetto include Dockerfile standalone ottimizzato e docker-compose.yml preconfigurato con etichette Traefik SSL:

`ash
# Avvio del container isolato del tenant
SUBDOMAIN=cliente1 TAAAAC_TOKEN="token_segreto" docker compose up -d --build
`
Traefik routerà automaticamente il traffico HTTPS da https://cliente1.taaaac.eu con certificato Let's Encrypt al container.
