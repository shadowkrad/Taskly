"use client";

import { useState, useEffect, useRef } from "react";
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
  Smartphone,
  ChevronRight,
  ChevronDown,
  Globe,
  Share2,
  MessageCircle,
  Star,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import EmailSettingsCard from "@/components/dashboard/EmailSettingsCard";
import RegisteredDevicesCard from "@/components/dashboard/RegisteredDevicesCard";
import ShowcaseVisualStudio from "@/components/dashboard/showcase/ShowcaseVisualStudio";
import TelegramSettingsPanel, { TelegramSettingsData } from "@/components/dashboard/TelegramSettingsPanel";
import FidelitySettingsPanel, { FidelitySettingsData } from "@/components/dashboard/FidelitySettingsPanel";
import { Send, Award } from "lucide-react";
import { useTenantConfig } from "@/components/providers/TenantConfigProvider";

type SettingsTab = "attivita" | "reperibilita" | "email" | "whatsapp" | "telegram" | "fidelity" | "dispositivi" | "aspetto";

interface TabItem {
  id: SettingsTab;
  label: string;
  shortLabel: string;
  iconComponent: React.ElementType;
  shortDescription: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: "attivita",
    label: "Attività & Sede",
    shortLabel: "Attività",
    iconComponent: Building2,
    shortDescription: "Anagrafica, P.IVA e sede",
    description: "Ragione sociale, P.IVA, sede operativa e recapiti di reperibilità",
  },
  {
    id: "reperibilita",
    label: "Reperibilità & Tariffe",
    shortLabel: "Tariffe",
    iconComponent: Clock,
    shortDescription: "Urgenze H24 e tariffe",
    description: "Pronto intervento H24, diritto di chiamata fisso e fasce d'urgenza",
  },
  {
    id: "email",
    label: "Email & Notifiche",
    shortLabel: "Email",
    iconComponent: Mail,
    shortDescription: "Taaaac Engine e ticket",
    description: "Canale email Taaaac Mail Engine e aggiornamenti ticket cliente",
  },
  {
    id: "whatsapp",
    label: "WhatsApp & Urgenze",
    shortLabel: "WhatsApp",
    iconComponent: MessageSquare,
    shortDescription: "Notifiche arrivo tecnico",
    description: "Notifiche automatiche WhatsApp su apertura guasti e arrivo tecnico",
  },
  {
    id: "telegram",
    label: "Telegram Hub & Tecnici",
    shortLabel: "Telegram",
    iconComponent: Send,
    shortDescription: "Bot ed avvisi tecnici",
    description: "Notifiche guasti e ticket urgenti su gruppo Telegram della squadra e One-Tap Connect",
  },
  {
    id: "fidelity",
    label: "Fidelity & Punti",
    shortLabel: "Fidelity",
    iconComponent: Award,
    shortDescription: "Raccolta punti e premi",
    description: "Fidelizzazione clienti privati e condomini con numero di telefono e catalogo premi",
  },
  {
    id: "dispositivi",
    label: "Dispositivi PWA",
    shortLabel: "Dispositivi",
    iconComponent: Smartphone,
    shortDescription: "Biometria e palmari tecnici",
    description: "Accesso biometrico FaceID/PIN e revoca/disconnessione palmari tecnici da remoto",
  },
  {
    id: "aspetto",
    label: "Aspetto & Brand",
    shortLabel: "Aspetto",
    iconComponent: Palette,
    shortDescription: "Logo, colori e rapportini",
    description: "Personalizzazione logo tecnico, tema indaco e layout rapportino",
  },
];

export default function TasklyImpostazioniPage() {
  const { config } = useTenantConfig();
  const [activeTab, setActiveTab] = useState<SettingsTab>("attivita");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  // Telegram & Fidelity State
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettingsData>({
    enabled: false,
    botToken: "",
    botUsername: "",
    staffChatId: "",
  });

  const [fidelitySettings, setFidelitySettings] = useState<FidelitySettingsData>({
    enabled: false,
    pointsPerEuro: 1,
    welcomeBonusPoints: 15,
    minPointsToRedeem: 50,
    rewards: [],
  });

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
    logoUrl: "",
    faviconUrl: "",
  });

  // Brand Assets State & Refs
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [dragActiveFavicon, setDragActiveFavicon] = useState(false);
  const [imageProcessing, setImageProcessing] = useState<string | null>(null);

  // Omnichannel State
  const [channelStatus, setChannelStatus] = useState<any>(null);
  const [syncingOmnichannel, setSyncingOmnichannel] = useState(false);

  const handleSyncOmnichannel = async () => {
    setSyncingOmnichannel(true);
    setFeedback(null);
    try {
      const days: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] = [
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
      ];
      
      const weeklyHours = days.map((d) => {
        if (form.h24Attivo) {
          return {
            dayOfWeek: d,
            isOpen: true,
            slots: [{ open: "00:00", close: "23:59" }],
          };
        }
        if (d === "SUNDAY") {
          return { dayOfWeek: d, isOpen: false, slots: [] };
        }
        if (d === "SATURDAY") {
          return {
            dayOfWeek: d,
            isOpen: true,
            slots: [{ open: "08:00", close: "13:00" }],
          };
        }
        return {
          dayOfWeek: d,
          isOpen: true,
          slots: [{ open: "08:00", close: "18:00" }],
        };
      });

      const res = await fetch("/api/sync/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weeklyHours }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Errore sincronizzazione canali");
      }

      setFeedback({
        type: "success",
        text: "🚀 Reperibilità e orari tecnici sincronizzati all'unisono su Google Maps, Meta e WhatsApp!",
      });
      const st = await fetch("/api/sync/channels").then((r) => r.json()).catch(() => null);
      if (st) setChannelStatus(st);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Errore durante la sincronizzazione" });
    } finally {
      setSyncingOmnichannel(false);
    }
  };

  useEffect(() => {
    fetch("/api/sync/channels")
      .then((r) => r.json())
      .then((st) => setChannelStatus(st))
      .catch(() => {});

    fetch("/api/impostazioni")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm((f) => ({
            ...f,
            nomeAttivita: data.nomeAttivita || f.nomeAttivita,
            logoUrl: data.logoUrl || "",
            faviconUrl: data.faviconUrl || "",
            colorePrimario: data.colorePrimario || f.colorePrimario,
            coloreAccento: data.coloreAccento || f.coloreAccento,
            emailUfficio: data.emailUfficio || f.emailUfficio,
            telefonoUrgenze: data.telefonoUrgenze || f.telefonoUrgenze,
          }));
          if (data.telegramSettings) setTelegramSettings(data.telegramSettings);
          if (data.fidelitySettings) setFidelitySettings(data.fidelitySettings);
        }
      })
      .catch((err) => console.error("Errore caricamento impostazioni:", err));
  }, []);

  const processImageFile = (
    file: File,
    maxSize: number,
    format: "image/webp" | "image/png",
    callback: (dataUrl: string) => void
  ) => {
    if (!file.type.startsWith("image/")) {
      setFeedback({ type: "error", text: "Il file selezionato non è un'immagine valida." });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFeedback({ type: "error", text: "L'immagine supera gli 8MB. Seleziona un file più leggero." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(format, format === "image/webp" ? 0.9 : undefined);
        callback(dataUrl);
      };
      img.onerror = () => {
        setFeedback({ type: "error", text: "Impossibile elaborare l'immagine caricata." });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/impostazioni", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeAttivita: form.nomeAttivita,
          logoUrl: form.logoUrl || "",
          faviconUrl: form.faviconUrl || "",
          colorePrimario: form.colorePrimario,
          coloreAccento: form.coloreAccento,
          emailUfficio: form.emailUfficio,
          telefonoUrgenze: form.telefonoUrgenze,
          telegramSettings,
          fidelitySettings,
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", text: "Impostazioni operative salvate con successo!" });
      } else {
        setFeedback({ type: "error", text: "Errore durante il salvataggio." });
      }
    } catch {
      setFeedback({ type: "error", text: "Errore durante il salvataggio." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);
  const ActiveIcon = currentTab?.iconComponent || Building2;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
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

        {activeTab !== "aspetto" && (
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
        )}
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

      {/* LAYOUT A 2 COLONNE: NAVIGAZIONE VERTICALE A SINISTRA + CONTENUTI A DESTRA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNA SINISTRA: MENU SEZIONI IMPOSTAZIONI */}
        <aside className="lg:col-span-4 xl:col-span-3 sticky top-14 lg:top-6 z-30 space-y-3">
          {/* Selettore Dropdown Compatto per Mobile (< lg) */}
          <div className="lg:hidden bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-sm">
            <label htmlFor="settings-tab-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Sezione Attiva
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600">
                <ActiveIcon className="w-4 h-4" />
              </div>
              <select
                id="settings-tab-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                {TABS.map((tab) => (
                  <option key={tab.id} value={tab.id} className="bg-white text-slate-800 py-1">
                    {tab.label} — {tab.shortDescription}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Barra di Navigazione Verticale Completa per Desktop (>= lg) */}
          <div className="hidden lg:block bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shadow-xs">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sezioni Impostazioni
              </span>
            </div>

            <nav
              className="flex flex-col gap-1.5 pt-2"
              aria-label="Sezioni Impostazioni Taskly"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComp = tab.iconComponent;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center justify-between w-full p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 text-indigo-950 font-semibold border border-indigo-200/80 shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5">
                          <span>{tab.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal truncate">
                          {tab.shortDescription}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive
                          ? "text-indigo-600 translate-x-0.5"
                          : "text-slate-300 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* COLONNA DESTRA: PANNELLO CONTENUTI */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Header contestuale scheda attiva */}
          {currentTab && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {currentTab.label}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{currentTab.description}</p>
                </div>
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

          {/* Hub Sincronizzazione Omnicanale */}
          <div className="pt-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 shadow-lg text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Hub Sincronizzazione Omnicanale
                      <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 font-black px-2 py-0.5 rounded-full border border-indigo-500/30">
                        v1.1.0 All'Unisono
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Un solo click aggiorna orari operativi e reperibilità H24 su Google Maps, Meta (Facebook & IG) e WhatsApp Business.
                    </p>
                  </div>
                </div>
                {channelStatus?.lastOmnichannelSyncAt && (
                  <div className="text-[11px] text-slate-400">
                    Ultima sinc: <span className="text-slate-200 font-mono">{new Date(channelStatus.lastOmnichannelSyncAt).toLocaleString("it-IT")}</span>
                  </div>
                )}
              </div>

              {/* Canali Connessi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">Google Maps</div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${channelStatus?.channels?.google?.enabled ? "bg-emerald-400" : "bg-indigo-400"}`} />
                      {channelStatus?.channels?.google?.enabled ? "Collegato" : "Pronto (Core)"}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">Facebook & IG</div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${channelStatus?.channels?.meta?.enabled ? "bg-emerald-400" : "bg-indigo-400"}`} />
                      {channelStatus?.channels?.meta?.enabled ? "Collegato" : "Pronto (Core)"}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">WhatsApp</div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Attivo 1-Click
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">Review Booster</div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Email 5 Stelle
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleSyncOmnichannel}
                  disabled={syncingOmnichannel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {syncingOmnichannel ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  🚀 Salva e Sincronizza Reperibilità su Google & Canali
                </button>
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

      {/* TAB 6: ASPETTO & BRAND (LIVE SHOWCASE VISUAL STUDIO) */}
      {activeTab === "aspetto" && (
        <div className="space-y-6">
          <ShowcaseVisualStudio />
        </div>
      )}
        </main>
      </div>
    </div>
  );
}
