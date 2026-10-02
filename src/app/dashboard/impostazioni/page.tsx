"use client";

import { useState } from "react";
import {
  Settings,
  Clock,
  Wrench,
  Building2,
  Mail,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Shield,
  Phone,
  Euro,
} from "lucide-react";
import EmailSettingsCard from "@/components/dashboard/EmailSettingsCard";
import RegisteredDevicesCard from "@/components/dashboard/RegisteredDevicesCard";
import { useTenantConfig } from "@/components/providers/TenantConfigProvider";

type SettingsTab = "attivita" | "reperibilita" | "email" | "whatsapp" | "dispositivi" | "aspetto";

interface TabItem {
  id: SettingsTab;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: "attivita",
    label: "Attività & Sede",
    shortLabel: "Attività",
    icon: "🏢",
    description: "Ragione sociale, P.IVA, sede operativa e recapiti di reperibilità",
  },
  {
    id: "reperibilita",
    label: "Reperibilità & Tariffe",
    shortLabel: "Tariffe",
    icon: "⏰",
    description: "Pronto intervento H24, diritto di chiamata fisso e fasce d'urgenza",
  },
  {
    id: "email",
    label: "Email & Notifiche",
    shortLabel: "Email",
    icon: "📧",
    description: "Canale email Taaaac Mail Engine e aggiornamenti ticket cliente",
  },
  {
    id: "whatsapp",
    label: "WhatsApp & Urgenze",
    shortLabel: "WhatsApp",
    icon: "💬",
    description: "Notifiche automatiche WhatsApp su apertura guasti e arrivo tecnico",
  },
  {
    id: "dispositivi",
    label: "Dispositivi PWA",
    shortLabel: "Dispositivi",
    icon: "📱",
    description: "Accesso biometrico FaceID/PIN e revoca/disconnessione palmari tecnici da remoto",
  },
  {
    id: "aspetto",
    label: "Aspetto & Brand",
    shortLabel: "Aspetto",
    icon: "🎨",
    description: "Personalizzazione logo tecnico, tema indaco e layout rapportino",
  },
];

export default function TasklyImpostazioniPage() {
  const { config } = useTenantConfig();
  const [activeTab, setActiveTab] = useState<SettingsTab>("attivita");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [form, setForm] = useState({
    nomeAttivita: config?.nomeAttivita || "Taskly Impianti & Servizi",
    referente: "Alessio Guidelli",
    partitaIva: "IT02345678901",
    indirizzo: "Via dell'Artigianato, 18 - 52100 Arezzo (AR)",
    telefonoUrgenze: "+39 340 1234567",
    emailUfficio: "assistenza@tasklyimpianti.it",
    h24Attivo: true,
    dirittoChiamata: "50",
    tariffaOrariaStandard: "40",
    tariffaOrariaFestiva: "65",
    whatsappAbilitato: true,
    colorePrimario: "#1e1b4b",
    coloreAccento: "#4f46e5",
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setFeedback({ type: "success", text: "Impostazioni operative salvate con successo!" });
    } catch {
      setFeedback({ type: "error", text: "Errore durante il salvataggio." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Intestazione Principale */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <span>🔧 Assistenza & Manutenzioni</span>
            <span>•</span>
            <span>Configurazione Operativa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-600" />
            Impostazioni Taskly
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configura reperibilità H24, tariffe di chiamata, dispositivi palmari PWA e notifiche.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Salvataggio...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salva Modifiche</span>
            </>
          )}
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* SOTTOMENU / TABS BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 sm:p-2 shadow-xs">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Impostazioni Taskly">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-xs shadow-indigo-600/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Intestazione Sottomenu Corrente */}
      {currentTab && (
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{currentTab.icon}</span>
              <span>{currentTab.label}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentTab.description}</p>
          </div>
        </div>
      )}

      {/* CONTENUTO SCHEDE */}

      {/* TAB 1: ATTIVITÀ & SEDE */}
      {activeTab === "attivita" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ragione Sociale / Nome Ditta</label>
              <input
                type="text"
                value={form.nomeAttivita}
                onChange={(e) => setForm({ ...form, nomeAttivita: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Partita IVA / Codice Fiscale</label>
              <input
                type="text"
                value={form.partitaIva}
                onChange={(e) => setForm({ ...form, partitaIva: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Responsabile Tecnico</label>
              <input
                type="text"
                value={form.referente}
                onChange={(e) => setForm({ ...form, referente: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sede Operativa / Magazzino</label>
              <input
                type="text"
                value={form.indirizzo}
                onChange={(e) => setForm({ ...form, indirizzo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefono Reperibilità / Urgenze</label>
              <input
                type="text"
                value={form.telefonoUrgenze}
                onChange={(e) => setForm({ ...form, telefonoUrgenze: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Ufficio Assistenza</label>
              <input
                type="email"
                value={form.emailUfficio}
                onChange={(e) => setForm({ ...form, emailUfficio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPERIBILITÀ & TARIFFE */}
      {activeTab === "reperibilita" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div>
              <p className="text-sm font-bold text-slate-900">Abilita Pronto Intervento H24</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Mostra il banner di emergenza notturna/festiva e consente l'invio di ticket con priorità critica.
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.h24Attivo}
              onChange={(e) => setForm({ ...form, h24Attivo: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-600 block">Diritto Fisso di Chiamata</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">€</span>
                <input
                  type="number"
                  value={form.dirittoChiamata}
                  onChange={(e) => setForm({ ...form, dirittoChiamata: e.target.value })}
                  className="w-24 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-600 block">Tariffa Oraria Standard</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">€</span>
                <input
                  type="number"
                  value={form.tariffaOrariaStandard}
                  onChange={(e) => setForm({ ...form, tariffaOrariaStandard: e.target.value })}
                  className="w-24 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-sm"
                />
                <span className="text-slate-400">/ora</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-600 block">Tariffa Oraria Notte/Festivi</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">€</span>
                <input
                  type="number"
                  value={form.tariffaOrariaFestiva}
                  onChange={(e) => setForm({ ...form, tariffaOrariaFestiva: e.target.value })}
                  className="w-24 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-indigo-700 text-sm"
                />
                <span className="text-slate-400">/ora</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL & NOTIFICHE */}
      {activeTab === "email" && (
        <div className="space-y-4">
          <EmailSettingsCard />
        </div>
      )}

      {/* TAB 4: WHATSAPP & URGENZE */}
      {activeTab === "whatsapp" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-900">Notifiche Interventi WhatsApp</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Invia un messaggio WhatsApp al cliente con la presa in carico del ticket e l'orario stimato d'arrivo del tecnico.
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.whatsappAbilitato}
              onChange={(e) => setForm({ ...form, whatsappAbilitato: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-slate-700 space-y-2">
            <span className="text-indigo-900 font-bold block text-sm">Messaggio Presa in Carico Intervento:</span>
            <div className="p-3 rounded-lg bg-white font-mono text-[11px] text-slate-800 leading-relaxed border border-indigo-200">
              Gentile &#123;&#123;nome_cliente&#125;&#125;, la richiesta di pronto intervento #&#123;&#123;id_ticket&#125;&#125; è stata assegnata al tecnico &#123;&#123;nome_tecnico&#125;&#125;. Orario stimato di arrivo: &#123;&#123;orario_stimato&#125;&#125;. Per dettagli: &#123;&#123;link_ticket&#125;&#125;
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DISPOSITIVI PWA */}
      {activeTab === "dispositivi" && (
        <div className="space-y-4">
          <RegisteredDevicesCard />
        </div>
      )}

      {/* TAB 6: ASPETTO & BRAND */}
      {activeTab === "aspetto" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Colore Primario Aziendale</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.colorePrimario}
                  onChange={(e) => setForm({ ...form, colorePrimario: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-slate-700 font-bold">{form.colorePrimario}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Colore Accento & Bottoni</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.coloreAccento}
                  onChange={(e) => setForm({ ...form, coloreAccento: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-indigo-700 font-bold">{form.coloreAccento}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
