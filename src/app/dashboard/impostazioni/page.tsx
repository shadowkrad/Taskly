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
    logoUrl: "",
    faviconUrl: "",
  });

  // Brand Assets State & Refs
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [dragActiveFavicon, setDragActiveFavicon] = useState(false);
  const [imageProcessing, setImageProcessing] = useState<string | null>(null);

  useEffect(() => {
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
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span>🎨</span> Colori Aziendali & Rapportini
            </h3>
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

          {/* Brand & Identità Visiva (Logo & Favicon) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>✨</span> Brand & Identità Visiva (Logo & Favicon)
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Novità v1.0.2
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LOGO */}
              <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🖼️</span> Logo Azienda & Assistenza
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Visibile nella barra di navigazione del portale pubblico e sui rapportini cliente.
                    </p>
                  </div>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logoUrl: "" })}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition border border-rose-200"
                    >
                      Rimuovi Logo
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageProcessing("logo");
                      processImageFile(file, 512, "image/webp", (dataUrl) => {
                        setForm((f) => ({ ...f, logoUrl: dataUrl }));
                        setImageProcessing(null);
                      });
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveLogo(true);
                  }}
                  onDragLeave={() => setDragActiveLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveLogo(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setImageProcessing("logo");
                      processImageFile(file, 512, "image/webp", (dataUrl) => {
                        setForm((f) => ({ ...f, logoUrl: dataUrl }));
                        setImageProcessing(null);
                      });
                    }
                  }}
                  onClick={() => logoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    dragActiveLogo
                      ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200"
                      : "border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/20"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📁</span>
                    <div className="text-xs text-slate-700 font-medium">
                      <span className="text-indigo-600 font-bold underline">Clicca per caricare</span> o trascina qui il file
                    </div>
                    <p className="text-[10px] text-slate-400">
                      PNG, SVG, JPG o WebP (ottimizzato automaticamente a max 512px WebP)
                    </p>
                    {imageProcessing === "logo" && (
                      <span className="text-xs font-semibold text-indigo-600 animate-pulse">
                        Elaborazione immagine in corso...
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Oppure inserisci URL Logo
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="https://tuosito.it/logo.png"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  />
                </div>

                {/* Anteprima Live Header */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Anteprima Navbar Portale</span>
                    <span className="text-[10px] text-slate-400 font-normal">Live Preview</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {form.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={form.logoUrl}
                            alt="Logo"
                            className="h-8 max-w-[140px] object-contain rounded"
                            onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] text-white">🔧</span>
                            <span className="truncate">{form.nomeAttivita}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 hidden sm:inline">Servizi</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">Reperibilità</span>
                        <span
                          style={{ backgroundColor: form.coloreAccento }}
                          className="text-[10px] text-white font-bold px-2.5 py-1 rounded-full shadow-xs"
                        >
                          Richiedi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAVICON */}
              <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🌐</span> Favicon & Icona Browser
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Icona visibile nella scheda del browser, nei preferiti e nella barra indirizzi.
                    </p>
                  </div>
                  {form.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, faviconUrl: "" })}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition border border-rose-200"
                    >
                      Rimuovi Favicon
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={faviconInputRef}
                  accept="image/png,image/x-icon,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageProcessing("favicon");
                      processImageFile(file, 128, "image/png", (dataUrl) => {
                        setForm((f) => ({ ...f, faviconUrl: dataUrl }));
                        setImageProcessing(null);
                      });
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveFavicon(true);
                  }}
                  onDragLeave={() => setDragActiveFavicon(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveFavicon(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setImageProcessing("favicon");
                      processImageFile(file, 128, "image/png", (dataUrl) => {
                        setForm((f) => ({ ...f, faviconUrl: dataUrl }));
                        setImageProcessing(null);
                      });
                    }
                  }}
                  onClick={() => faviconInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    dragActiveFavicon
                      ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200"
                      : "border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/20"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🔖</span>
                    <div className="text-xs text-slate-700 font-medium">
                      <span className="text-indigo-600 font-bold underline">Carica icona</span> o trascina qui
                    </div>
                    <p className="text-[10px] text-slate-400">
                      PNG, ICO o SVG quadrata (ottimizzata automaticamente a 128x128 PNG)
                    </p>
                    {imageProcessing === "favicon" && (
                      <span className="text-xs font-semibold text-indigo-600 animate-pulse">
                        Elaborazione icona in corso...
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Oppure inserisci URL Favicon
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="https://tuosito.it/favicon.ico o /icon.svg"
                    value={form.faviconUrl}
                    onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                  />
                </div>

                {/* Anteprima Live Scheda Browser */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Anteprima Scheda Browser</span>
                    <span className="text-[10px] text-slate-400 font-normal">Live Preview</span>
                  </div>
                  <div className="rounded-xl border border-slate-300 bg-slate-100 p-2.5 shadow-xs">
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-t-lg border-t border-x border-slate-200 shadow-xs max-w-[260px]">
                      {form.faviconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.faviconUrl}
                          alt="Favicon"
                          className="w-4 h-4 rounded-xs object-contain shrink-0"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      ) : (
                        <span className="text-xs shrink-0">🔧</span>
                      )}
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {form.nomeAttivita} — Taskly
                      </span>
                      <span className="text-[10px] text-slate-400 hover:text-slate-600 ml-1 shrink-0 cursor-default">
                        ✕
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
