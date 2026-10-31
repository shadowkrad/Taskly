"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShowcaseConfig,
  DEFAULT_TASKLY_SHOWCASE_CONFIG,
  DEFAULT_TASKLY_CONTACT_INFO,
  GalleryPhotoItem,
} from "@/lib/showcase-defaults";
import {
  Sparkles,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Type,
  Palette,
  Eye,
  Sliders,
  Plus,
  Trash2,
  Upload,
  Star,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Phone,
  Wrench,
  ArrowRight,
  Quote,
  Zap,
} from "lucide-react";

type ControlTab = "hero" | "media" | "colori" | "chisiamo" | "contatti" | "sezioni" | "badges";

export default function ShowcaseVisualStudio() {
  const [config, setConfig] = useState<ShowcaseConfig>(DEFAULT_TASKLY_SHOWCASE_CONFIG);
  const [activeControlTab, setActiveControlTab] = useState<ControlTab>("hero");
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageProcessing, setImageProcessing] = useState<string | null>(null);

  // File Inputs Refs
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const aboutImageInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/impostazioni/vetrina")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.config) {
          setConfig(data.config);
        } else if (data && !data.error) {
          setConfig(data);
        }
      })
      .catch((err) => console.error("Errore fetch vetrina Taskly:", err))
      .finally(() => setLoading(false));
  }, []);

  // Utility di compressione WebP lato client
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
    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: "error", text: "L'immagine supera i 10MB. Seleziona un file più leggero." });
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
        const dataUrl = canvas.toDataURL(format, format === "image/webp" ? 0.88 : undefined);
        callback(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/impostazioni/vetrina", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setFeedback({ type: "success", text: "Vetrina aziendale aggiornata con successo!" });
      } else {
        setFeedback({ type: "error", text: "Errore durante il salvataggio della vetrina." });
      }
    } catch {
      setFeedback({ type: "error", text: "Errore di connessione." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Vuoi ripristinare i testi e la grafica predefinita di Taskly?")) {
      setConfig({ ...DEFAULT_TASKLY_SHOWCASE_CONFIG });
      setFeedback({ type: "success", text: "Valori predefiniti ripristinati. Clicca Salva per confermare." });
    }
  };

  const addGalleryImage = (dataUrl: string) => {
    const newImg: GalleryPhotoItem = {
      id: `img_${Date.now()}`,
      url: dataUrl,
      caption: "Intervento & Squadra Tecnica",
    };
    setConfig((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: [...(prev.gallery.images || []), newImg],
      },
    }));
  };

  const removeGalleryImage = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: prev.gallery.images.filter((img) => img.id !== id),
      },
    }));
  };

  const updateGalleryCaption = (id: string, caption: string) => {
    setConfig((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: prev.gallery.images.map((img) => (img.id === id ? { ...img, caption } : img)),
      },
    }));
  };

  const addTrustBadge = () => {
    const newBadge = {
      id: `badge_${Date.now()}`,
      icon: "check" as const,
      text: "Nuova Garanzia / Certificazione",
    };
    setConfig((prev) => ({
      ...prev,
      trustBadges: [...(prev.trustBadges || []), newBadge],
    }));
  };

  const removeTrustBadge = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      trustBadges: prev.trustBadges.filter((b) => b.id !== id),
    }));
  };

  const updateTrustBadge = (id: string, text: string, icon: any) => {
    setConfig((prev) => ({
      ...prev,
      trustBadges: prev.trustBadges.map((b) => (b.id === id ? { ...b, text, icon } : b)),
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Caricamento Visual Studio Vetrina...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Visual Studio */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Live Showcase Visual Studio • Pronto Intervento & Impianti</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Personalizzazione Vetrina Interattiva
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Modifica in tempo reale claim d&apos;urgenza, foto del parco mezzi, garanzie certificate e palette colori con simulatore responsive integrato.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Vedi Sito Live</span>
          </a>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition border border-white/10 cursor-pointer"
            title="Ripristina testi predefiniti Taskly"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvataggio...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salva Vetrina</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* LAYOUT SPLIT-SCREEN: CONTROLLI (SINISTRA) + ANTEPRIMA RESPONSIVE (DESTRA) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* COLONNA CONTROLLI EDITING */}
        <div className="xl:col-span-6 space-y-4">
          {/* BARRA TAB CONTROLLI */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1">
            {[
              { id: "hero", label: "Hero & Cover", icon: Flame },
              { id: "media", label: "Galleria Mezzi", icon: ImageIcon },
              { id: "colori", label: "Brand & Colori", icon: Palette },
              { id: "chisiamo", label: "Chi Siamo / Squadra", icon: Type },
              { id: "badges", label: "Trust Badges", icon: Award },
              { id: "sezioni", label: "Sezioni & Titoli", icon: Eye },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeControlTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveControlTab(tab.id as ControlTab)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* PANNELLO ATTIVO CONTROLLI */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
            {/* TAB 1: HERO & COVER */}
            {activeControlTab === "hero" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-indigo-600" />
                    <span>Sezione Principale (Hero Pronto Intervento)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Claim d&apos;urgenza e pulsanti di chiamata rapida per i clienti.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge in Evidenza
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    value={config.hero.badgeText}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, badgeText: e.target.value },
                      }))
                    }
                    placeholder="Es. 🔧 Pronto Intervento H24 Certificato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Titolo Principale (Claim)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    value={config.hero.title}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, title: e.target.value },
                      }))
                    }
                    placeholder="Es. Pronto Intervento & Assistenza Tecnica a Domicilio"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sottotitolo Descrittivo
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-y"
                    value={config.hero.subtitle}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: e.target.value },
                      }))
                    }
                    placeholder="Descrivi tempestività, garanzia sui lavori e settori d'intervento..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Testo Pulsante Primario
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.hero.ctaPrimaryText}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, ctaPrimaryText: e.target.value },
                        }))
                      }
                      placeholder="Es. Richiedi Pronto Intervento ⚡"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Testo Pulsante Secondario
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.hero.ctaSecondaryText}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, ctaSecondaryText: e.target.value },
                        }))
                      }
                      placeholder="Es. I Nostri Servizi & Tariffe"
                    />
                  </div>
                </div>

                {/* Cover Image Upload & Slider Opacity */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Immagine Copertina Panoramica (Cover)
                    </label>
                    {config.hero.coverImageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, coverImageUrl: null },
                          }))
                        }
                        className="text-[11px] text-rose-600 hover:underline font-semibold"
                      >
                        Rimuovi Cover
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageProcessing("cover");
                        processImageFile(file, 1280, "image/webp", (dataUrl) => {
                          setConfig((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, coverImageUrl: dataUrl },
                          }));
                          setImageProcessing(null);
                        });
                      }
                    }}
                  />

                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition"
                  >
                    <div className="flex flex-col items-center gap-1.5 text-xs text-slate-600">
                      <Upload className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-indigo-600">
                        Carica foto furgone o officina
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Ottimizzata automaticamente in formato WebP HD
                      </span>
                      {imageProcessing === "cover" && (
                        <span className="text-[11px] text-indigo-600 animate-pulse font-bold">
                          Elaborazione immagine in corso...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slider Oscuramento Sfondo per Leggibilità */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Filtro Contrasto / Opacità Sfondo</span>
                      <span className="text-indigo-600 font-mono">{config.hero.overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={95}
                      value={config.hero.overlayOpacity}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, overlayOpacity: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Più chiaro (luminoso)</span>
                      <span>Consigliato (80%)</span>
                      <span>Più scuro (massimo contrasto)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GALLERIA INTERVENTI & PARCO MEZZI */}
            {activeControlTab === "media" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Galleria Interventi & Parco Mezzi</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mostra furgoni attrezzati, quadri elettrici, caldaie e lavorazioni certificate.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-slate-600">Abilitata</span>
                    <input
                      type="checkbox"
                      checked={config.gallery.enabled}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gallery: { ...prev.gallery, enabled: e.target.checked },
                        }))
                      }
                      className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Titolo Galleria
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.gallery.title}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gallery: { ...prev.gallery, title: e.target.value },
                        }))
                      }
                      placeholder="Es. I Nostri Interventi & Parco Mezzi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sottotitolo Galleria
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.gallery.subtitle}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gallery: { ...prev.gallery, subtitle: e.target.value },
                        }))
                      }
                      placeholder="Es. Lavorazioni certificate e ricambi originali"
                    />
                  </div>
                </div>

                {/* Caricamento Foto */}
                <input
                  type="file"
                  ref={galleryInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageProcessing("gallery");
                      processImageFile(file, 800, "image/webp", (dataUrl) => {
                        addGalleryImage(dataUrl);
                        setImageProcessing(null);
                      });
                    }
                  }}
                />

                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition"
                >
                  <div className="flex flex-col items-center gap-1 text-xs text-slate-600">
                    <Plus className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-600">Aggiungi foto alla galleria</span>
                    <span className="text-[10px] text-slate-400">
                      Formato WebP leggero e veloce al caricamento
                    </span>
                    {imageProcessing === "gallery" && (
                      <span className="text-[11px] text-indigo-600 animate-pulse font-bold">
                        Elaborazione foto in corso...
                      </span>
                    )}
                  </div>
                </div>

                {/* Lista Foto Esistenti */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {config.gallery.images?.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="group relative border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs p-2 space-y-2"
                    >
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.caption || `Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-80 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                          title="Elimina foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={img.caption || ""}
                        onChange={(e) => updateGalleryCaption(img.id, e.target.value)}
                        placeholder="Didascalia foto..."
                        className="w-full text-[11px] border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BRAND & COLORI */}
            {activeControlTab === "colori" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <span>Brand & Palette Colori</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nome azienda, colore primario e colore di accento per tasti e avvisi d&apos;urgenza.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Azienda / Servizio
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    value={config.brandName}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        brandName: e.target.value,
                      }))
                    }
                    placeholder="Es. Taskly Impianti & Pronto Intervento"
                  />
                </div>

                {/* LOGO AZIENDALE E FAVICON PWA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  {/* LOGO AZIENDA */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Logo Ufficiale Azienda
                      </label>
                      {config.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, logoUrl: null }))}
                          className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Rimuovi
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageProcessing("logo");
                          processImageFile(file, 512, "image/webp", (dataUrl) => {
                            setConfig((prev) => ({ ...prev, logoUrl: dataUrl }));
                            setImageProcessing(null);
                          });
                        }
                      }}
                    />
                    {config.logoUrl ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">Logo Personalizzato</div>
                          <p className="text-[10px] text-indigo-600 font-medium">Attivo su vetrina e navbar</p>
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="mt-1 text-xs text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Cambia Logo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-3 text-center cursor-pointer bg-white hover:bg-slate-50 transition"
                      >
                        <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                        <div className="text-xs text-slate-800 font-semibold">Carica Logo Azienda</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">PNG o WebP trasparente (max 512px)</p>
                      </button>
                    )}
                    {imageProcessing === "logo" && (
                      <div className="text-xs text-indigo-600 animate-pulse text-center">Ottimizzazione logo in corso...</div>
                    )}
                  </div>

                  {/* FAVICON & ICONA PWA */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Favicon &amp; Icona App (PWA)
                      </label>
                      {config.faviconUrl && (
                        <button
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, faviconUrl: null }))}
                          className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Rimuovi
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={faviconInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageProcessing("favicon");
                          processImageFile(file, 128, "image/png", (dataUrl) => {
                            setConfig((prev) => ({ ...prev, faviconUrl: dataUrl }));
                            setImageProcessing(null);
                          });
                        }
                      }}
                    />
                    {config.faviconUrl ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={config.faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">Icona Browser &amp; PWA</div>
                          <p className="text-[10px] text-indigo-600 font-medium">Formato 128x128 PNG HD</p>
                          <button
                            type="button"
                            onClick={() => faviconInputRef.current?.click()}
                            className="mt-1 text-xs text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Cambia Favicon</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => faviconInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-3 text-center cursor-pointer bg-white hover:bg-slate-50 transition"
                      >
                        <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                        <div className="text-xs text-slate-800 font-semibold">Carica Favicon / Icona App</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Quadrata, PNG o ICO (128x128 px)</p>
                      </button>
                    )}
                    {imageProcessing === "favicon" && (
                      <div className="text-xs text-indigo-600 animate-pulse text-center">Ottimizzazione favicon in corso...</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Colore Accento (Pulsanti & Badges)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.accentColor || "#4f46e5"}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white p-1"
                      />
                      <input
                        type="text"
                        value={config.accentColor || "#4f46e5"}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase w-28 bg-white"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Colore Primario Navbar & Sfondo
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.primaryColor || "#1e1b4b"}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white p-1"
                      />
                      <input
                        type="text"
                        value={config.primaryColor || "#1e1b4b"}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase w-28 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Colori Settore Tecnico */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Palette Pronte per Tecnici & Impiantisti
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Indaco High-Tech", primary: "#1e1b4b", accent: "#4f46e5" },
                      { name: "Blu Elettrico & Emergenze", primary: "#0f172a", accent: "#0284c7" },
                      { name: "Verde Sicurezza & Termoidraulica", primary: "#064e3b", accent: "#059669" },
                      { name: "Arancio Cantieri & Pronto Intervento", primary: "#18181b", accent: "#ea580c" },
                      { name: "Giallo Sicurezza & Fabbro", primary: "#1c1917", accent: "#eab308" },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            primaryColor: p.primary,
                            accentColor: p.accent,
                          }))
                        }
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center gap-1.5 transition"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: p.accent }}
                        />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CHI SIAMO / SQUADRA */}
            {activeControlTab === "chisiamo" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-600" />
                    <span>Chi Siamo & Squadra Tecnica</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fai conoscere la storia aziendale, l&apos;esperienza e le abilitazioni dei tuoi tecnici.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Titolo Sezione
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.about.title}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          about: { ...prev.about, title: e.target.value },
                        }))
                      }
                      placeholder="Es. La Nostra Squadra Tecnica"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sottotitolo
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={config.about.subtitle}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          about: { ...prev.about, subtitle: e.target.value },
                        }))
                      }
                      placeholder="Es. Oltre 15 anni di interventi risolutivi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Testo Descrittivo Completo
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-y"
                    value={config.about.description}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        about: { ...prev.about, description: e.target.value },
                      }))
                    }
                    placeholder="Racconta i punti di forza della tua ditta, parco mezzi e abilitazioni..."
                  />
                </div>

                {/* Citazione Responsabile Tecnico */}
                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80 space-y-3">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dichiarazione / Firma Responsabile Tecnico</span>
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Testo Citazione
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-indigo-400 focus:outline-none italic"
                      value={config.about.quoteText || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          about: { ...prev.about, quoteText: e.target.value },
                        }))
                      }
                      placeholder="Es. Risolvere un guasto tempestivamente garantisce la sicurezza e la serenità della casa."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Firma / Nome Professionista
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                      value={config.about.quoteAuthor || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          about: { ...prev.about, quoteAuthor: e.target.value },
                        }))
                      }
                      placeholder="Es. Alessio Guidelli — Responsabile Tecnico Abilitato"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: TRUST BADGES */}
            {activeControlTab === "badges" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Distintivi di Garanzia (Trust Badges)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mostrati sotto la Hero per rassicurare clienti e condomini sui tempi e sulle garanzie.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTrustBadge}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aggiungi</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {config.trustBadges?.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <select
                        value={b.icon}
                        onChange={(e) => updateTrustBadge(b.id, b.text, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-medium"
                      >
                        <option value="clock">⏱️ Tempi / Pronto Intervento</option>
                        <option value="shield">🛡️ Garanzia / Conformità D.M.</option>
                        <option value="award">🏆 Abilitazione & Certificato</option>
                        <option value="star">⭐ Stelle / Recensioni</option>
                        <option value="check">✓ Prezzo Trasparente</option>
                      </select>

                      <input
                        type="text"
                        value={b.text}
                        onChange={(e) => updateTrustBadge(b.id, e.target.value, b.icon)}
                        placeholder="Testo garanzia..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => removeTrustBadge(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        title="Rimuovi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SEZIONI & TITOLI */}
            {activeControlTab === "sezioni" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>Visibilità Sezioni Vetrina</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attiva o disattiva le singole sezioni del portale pubblico in un click.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "showHero", label: "Sezione Hero (Copertina)" },
                    { id: "showTrustBadges", label: "Distintivi di Garanzia (Badges)" },
                    { id: "showServices", label: "Listino Servizi & Tipologie" },
                    { id: "showGallery", label: "Galleria Mezzi & Interventi" },
                    { id: "showAbout", label: "Chi Siamo & Squadra" },
                    { id: "showHours", label: "Reperibilità H24 & Orari" },
                    { id: "showContact", label: "Centrale Operativa & Contatti" },
                  ].map((sec) => (
                    <label
                      key={sec.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition"
                    >
                      <span className="text-xs font-semibold text-slate-800">{sec.label}</span>
                      <input
                        type="checkbox"
                        checked={(config.sections as any)?.[sec.id] ?? true}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            sections: {
                              ...prev.sections,
                              [sec.id]: e.target.checked,
                            },
                          }))
                        }
                        className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Personalizzazione Titoli Sezioni
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Titolo Sezione Servizi
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        value={config.customLabels?.servicesTitle || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            customLabels: {
                              ...prev.customLabels,
                              servicesTitle: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Sottotitolo Sezione Servizi
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        value={config.customLabels?.servicesSubtitle || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            customLabels: {
                              ...prev.customLabels,
                              servicesSubtitle: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLONNA ANTEPRIMA RESPONSIVE LIVE */}
        <div className="xl:col-span-6 space-y-3 xl:sticky xl:top-6">
          {/* Selettore Device Desktop / Mobile */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Simulatore Vetrina Live</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                Sincronizzazione Real-Time
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  deviceMode === "mobile"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (390px)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  deviceMode === "desktop"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Full</span>
              </button>
            </div>
          </div>

          {/* FRAME DEL SIMULATORE */}
          <div className="flex justify-center w-full">
            <div
              className={`transition-all duration-300 overflow-hidden bg-white shadow-2xl border border-slate-300 ${
                deviceMode === "mobile"
                  ? "w-[390px] rounded-[40px] border-[8px] border-slate-900 shadow-2xl"
                  : "w-full rounded-2xl"
              }`}
            >
              {/* Notch per Mobile iPhone */}
              {deviceMode === "mobile" && (
                <div className="w-full bg-slate-900 pt-2 pb-1 flex justify-center items-center">
                  <div className="w-24 h-4 bg-black rounded-full" />
                </div>
              )}

              {/* CONTENUTO VETRINA RENDERIZZATO LIVE */}
              <div className="max-h-[640px] overflow-y-auto no-scrollbar font-sans text-slate-800 text-xs">
                {/* Navbar Vetrina */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {config.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.logoUrl}
                        alt="Logo"
                        className="h-6 w-auto object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-1 font-black text-slate-900 text-sm">
                        <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{config.brandName || "Taskly Impianti"}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    style={{ backgroundColor: config.accentColor || "#4f46e5" }}
                    className="text-[10px] text-white font-bold px-3 py-1.5 rounded-xl shadow-2xs pointer-events-none"
                  >
                    SOS H24 ⚡
                  </button>
                </div>

                {/* Hero Section */}
                {config.sections.showHero && (
                  <div
                    className="relative px-4 py-10 text-center overflow-hidden flex flex-col justify-center items-center min-h-[260px]"
                    style={{
                      backgroundImage: config.hero.coverImageUrl
                        ? `url(${config.hero.coverImageUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: config.primaryColor || "#1e1b4b",
                    }}
                  >
                    {/* Overlay scuro dinamico */}
                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: (config.hero.overlayOpacity ?? 80) / 100 }}
                    />

                    <div className="relative z-10 text-white space-y-3 max-w-sm mx-auto">
                      {config.hero.badgeText && (
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-md border border-white/20">
                          {config.hero.badgeText}
                        </span>
                      )}

                      <h1 className="text-lg sm:text-xl font-black tracking-tight leading-snug drop-shadow-md">
                        {config.hero.title}
                      </h1>

                      <p className="text-[11px] text-slate-200 line-clamp-3 leading-relaxed drop-shadow-sm">
                        {config.hero.subtitle}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span
                          style={{ backgroundColor: config.accentColor || "#4f46e5" }}
                          className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md"
                        >
                          {config.hero.ctaPrimaryText}
                        </span>
                        {config.hero.ctaSecondaryText && (
                          <span className="px-3 py-1.5 rounded-xl bg-white/20 text-white font-semibold text-[10px] backdrop-blur-md border border-white/30">
                            {config.hero.ctaSecondaryText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                {config.sections.showTrustBadges && (config.trustBadges?.length || 0) > 0 && (
                  <div className="bg-indigo-50/70 border-y border-indigo-100 py-2.5 px-3">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                      {config.trustBadges.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center gap-1 text-[10px] font-bold text-indigo-950"
                        >
                          <span className="text-indigo-600">🛡️</span>
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chi Siamo / Squadra */}
                {config.sections.showAbout && (
                  <div className="p-4 bg-white border-b border-slate-100 space-y-2.5">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        {config.about.subtitle}
                      </span>
                      <h3 className="text-sm font-black text-slate-900">
                        {config.about.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed text-center">
                      {config.about.description}
                    </p>
                    {config.about.quoteText && (
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center italic text-[10px] text-indigo-950">
                        &quot;{config.about.quoteText}&quot;
                        {config.about.quoteAuthor && (
                          <span className="block not-italic font-bold text-[9px] text-indigo-700 mt-1">
                            — {config.about.quoteAuthor}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Servizi & Interventi Demo */}
                {config.sections.showServices && (
                  <div className="p-4 bg-slate-50/60 border-b border-slate-100 space-y-3">
                    <div className="text-center">
                      <h3 className="text-sm font-black text-slate-900">
                        {config.customLabels?.servicesTitle || "Settori d'Intervento"}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {config.customLabels?.servicesSubtitle ||
                          "Assistenza rapida per privati, condomini e aziende"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { nome: "Pronto Intervento Idraulico H24", tempo: "< 60 min", tariffa: "Diritto chiamata fisso" },
                        { nome: "Riparazione Impianti Elettrici & Cortocircuiti", tempo: "Rapido", tariffa: "Certificato D.M. 37/08" },
                        { nome: "Manutenzione Caldaie & Condizionatori", tempo: "Ordinario/Urgenza", tariffa: "Rapportino Digitale" },
                      ].map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
                        >
                          <div>
                            <span className="block font-bold text-slate-800 text-[11px]">
                              {s.nome}
                            </span>
                            <span className="text-[9px] text-slate-400">⏱️ {s.tempo}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-indigo-600 text-[10px]">
                              {s.tariffa}
                            </span>
                            <span className="text-[9px] text-slate-400">Richiedi →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Galleria Foto Live */}
                {config.sections.showGallery &&
                  config.gallery?.enabled &&
                  (config.gallery.images?.length || 0) > 0 && (
                    <div className="p-4 bg-white border-b border-slate-100 space-y-2.5">
                      <div className="text-center">
                        <h3 className="text-sm font-black text-slate-900">
                          {config.gallery.title}
                        </h3>
                        <p className="text-[10px] text-slate-500">{config.gallery.subtitle}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {config.gallery.images.slice(0, 4).map((img, idx) => (
                          <div
                            key={img.id || idx}
                            className="relative h-20 rounded-lg overflow-hidden bg-slate-100 shadow-2xs"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.caption || "Intervento"}
                              className="w-full h-full object-cover"
                            />
                            {img.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[8px] text-white truncate">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Footer Vetrina */}
                <div className="p-4 bg-slate-950 text-white text-center space-y-1">
                  <span className="text-[11px] font-bold block">🔧 {config.brandName}</span>
                  <span className="text-[9px] text-slate-400 block">
                    Centrale operativa reperibile H24 365 giorni l&apos;anno
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
