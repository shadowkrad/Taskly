import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
            Servizio Professionale Certificato per Privati e Aziende
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Pronto Intervento & Assistenza Tecnica a Domicilio
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
            Idraulica, impianti elettrici, riparazione caldaie, condizionatori e apertura porte.
            Intervento in <strong>meno di 60 minuti</strong> per le emergenze o su appuntamento concordato.
          </p>

          {/* CTA Buttons: link a /prenotazione */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="tel:+393401234567"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
            >
              <Phone className="w-5 h-5" />
              Chiama Subito: +39 340 1234567
            </a>

            <a
              href="https://wa.me/393401234567?text=Salve,%20ho%20bisogno%20di%20informazioni%20per%20un%20intervento"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-sm sm:text-base transition-all"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Scrivi su WhatsApp
            </a>

            <Link
              href="/prenotazione"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-all"
            >
              <span>Richiedi Preventivo Rapido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="card-taaaac flex items-start gap-3 bg-white/90">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Arrivo Rapido 60 min</h4>
                <p className="text-xs text-slate-500 mt-0.5">Operatività rapida per allagamenti, guasti elettrici e porte bloccate.</p>
              </div>
            </div>

            <div className="card-taaaac flex items-start gap-3 bg-white/90">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Garanzia 24 Mesi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tutti i lavori e i ricambi installati sono garantiti e certificati a norma.</p>
              </div>
            </div>

            <div className="card-taaaac flex items-start gap-3 bg-white/90">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Prezzi Trasparenti</h4>
                <p className="text-xs text-slate-500 mt-0.5">Nessuna sorpresa: preventivo chiaro e rapportino digitale a fine lavoro.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
