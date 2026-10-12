import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ShowcaseConfig } from '@/lib/showcase-defaults';

interface HeroSectionProps {
  showcase?: ShowcaseConfig;
  phone?: string;
}

export function HeroSection({ showcase, phone }: HeroSectionProps) {
  const badgeText = showcase?.hero?.badgeText || "Servizio Professionale Certificato per Privati e Aziende";
  const title = showcase?.hero?.title || "Pronto Intervento & Assistenza Tecnica a Domicilio";
  const subtitle =
    showcase?.hero?.subtitle ||
    "Idraulica, impianti elettrici, riparazione caldaie, condizionatori e apertura porte. Intervento in meno di 60 minuti per le emergenze o su appuntamento concordato.";
  const ctaPrimary = showcase?.hero?.ctaPrimaryText || "Richiedi Preventivo Rapido";
  const ctaSecondary = showcase?.hero?.ctaSecondaryText || "I Nostri Servizi & Tariffe";
  const coverImageUrl = showcase?.hero?.coverImageUrl;
  const overlayOpacity = showcase?.hero?.overlayOpacity ?? 80;
  const accentColor = showcase?.accentColor || "#4f46e5";
  const trustBadges = showcase?.trustBadges || [
    { id: '1', icon: 'clock', text: 'Arrivo Rapido 60 min' },
    { id: '2', icon: 'shield', text: 'Garanzia 24 Mesi' },
    { id: '3', icon: 'check', text: 'Prezzi Trasparenti' },
  ];

  const telNumber = phone || "+39 340 1234567";

  return (
    <section
      className={`relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70 text-center ${
        coverImageUrl ? "text-white" : "bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-50 text-slate-900"
      }`}
      style={{
        backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay scuro se c'è immagine di copertina */}
      {coverImageUrl && (
        <div
          className="absolute inset-0 bg-black backdrop-blur-[0.5px]"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              coverImageUrl
                ? "bg-white/20 text-white backdrop-blur-md border border-white/20"
                : "bg-indigo-50 border border-indigo-200/80 text-indigo-700"
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>

          {/* Headline */}
          <h1
            className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight ${
              coverImageUrl ? "text-white drop-shadow-md" : "text-slate-900"
            }`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              coverImageUrl ? "text-slate-200 drop-shadow-sm" : "text-slate-600"
            }`}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={`tel:${telNumber.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span>Chiama Subito: {telNumber}</span>
            </a>

            <a
              href={`https://wa.me/${telNumber.replace(/[^0-9]/g, "")}?text=Salve,%20ho%20bisogno%20di%20informazioni%20per%20un%20intervento`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                coverImageUrl
                  ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>Scrivi su WhatsApp</span>
            </a>

            <Link
              href="/prenotazione"
              style={{ backgroundColor: accentColor }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-md transition-all active:scale-95 hover:opacity-95"
            >
              <span>{ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {trustBadges.map((tb, idx) => (
              <div
                key={tb.id || idx}
                className={`p-4 rounded-2xl flex items-start gap-3 transition ${
                  coverImageUrl
                    ? "bg-white/10 backdrop-blur-md border border-white/20 text-white"
                    : "bg-white border border-slate-200/90 shadow-2xs text-slate-900"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    coverImageUrl ? "bg-white/20 text-emerald-400" : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {tb.icon === "clock" && <Clock className="w-5 h-5" />}
                  {tb.icon === "shield" && <ShieldCheck className="w-5 h-5" />}
                  {tb.icon === "check" && <CheckCircle2 className="w-5 h-5" />}
                  {tb.icon !== "clock" && tb.icon !== "shield" && tb.icon !== "check" && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-snug">{tb.text}</h4>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      coverImageUrl ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    Assistenza tecnica specializzata e ricambi originali certificati.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
