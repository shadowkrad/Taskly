import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/public/HeroSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Wrench, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero con chiamata rapida WhatsApp e Telefono */}
      <HeroSection />

      {/* 2. Listino e Griglia Servizi */}
      <ServicesSection />

      {/* 3. Sezione CTA Richiesta Intervento (Stile Schedly: SOLO IL TASTO, form nella pagina dedicata /prenotazione) */}
      <section className="py-16 bg-slate-100/80 border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
            <Wrench className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Richiedi un Intervento o Preventivo in pochi secondi
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Descrivi il guasto, seleziona il livello di urgenza e ricevi assistenza immediata dai nostri tecnici specializzati con conferma e tracking del ticket.
          </p>
          <div className="pt-2">
            <Link
              href="/prenotazione"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-sm"
            >
              <span>Apri Modulo Richiesta Intervento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Footer con orari e contatti */}
      <PublicFooter />
    </div>
  );
}
