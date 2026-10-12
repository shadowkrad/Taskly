import React from 'react';
import Link from 'next/link';
import { prisma, ensureDatabaseSchema } from '@/lib/prisma';
import { HeroSection } from '@/components/public/HeroSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { PublicFooter } from '@/components/public/PublicFooter';
import { parseShowcaseConfig } from '@/lib/showcase-defaults';
import { Wrench, ArrowRight, Quote, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTasklyData() {
  try {
    await ensureDatabaseSchema();
    const cache = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });
    return { cache };
  } catch (e) {
    console.error("Errore recupero configurazione Taskly:", e);
    return { cache: null };
  }
}

export default async function HomePage() {
  const { cache } = await getTasklyData();
  const showcase = parseShowcaseConfig((cache as any)?.showcaseConfig);

  const phone = cache?.phone || "+39 340 1234567";

  return (
    <div className="flex flex-col min-h-full font-sans">
      {/* 1. Hero con chiamata rapida WhatsApp e Telefono */}
      {showcase.sections.showHero && (
        <HeroSection showcase={showcase} phone={phone} />
      )}

      {/* 2. Chi Siamo & Squadra Tecnica */}
      {showcase.sections.showAbout && showcase.about?.enabled && (
        <section id="chisiamo" className="py-20 px-4 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
              {showcase.about.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {showcase.about.title}
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" />
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              {showcase.about.description}
            </p>

            {showcase.about.quoteText && (
              <div className="mt-8 p-6 sm:p-8 bg-indigo-50/70 rounded-3xl border border-indigo-100 max-w-2xl mx-auto space-y-2">
                <p className="italic text-base sm:text-lg text-indigo-950 font-serif leading-relaxed">
                  &ldquo;{showcase.about.quoteText}&rdquo;
                </p>
                {showcase.about.quoteAuthor && (
                  <p className="not-italic text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    — {showcase.about.quoteAuthor}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Listino e Griglia Servizi */}
      {showcase.sections.showServices && (
        <ServicesSection />
      )}

      {/* 4. Galleria Mezzi & Interventi */}
      {showcase.sections.showGallery &&
        showcase.gallery?.enabled &&
        (showcase.gallery.images?.length || 0) > 0 && (
          <section id="galleria" className="py-20 px-4 bg-slate-50 border-y border-slate-200">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {showcase.gallery.title}
                </h2>
                <div className="w-16 h-1 bg-indigo-500 mx-auto mt-3 rounded-full" />
                <p className="text-slate-600 text-sm sm:text-base mt-4">
                  {showcase.gallery.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {showcase.gallery.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="group relative h-64 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition bg-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.caption || `Intervento ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-xs text-white">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* 5. Sezione CTA Richiesta Intervento Rapido */}
      <section className="py-16 bg-slate-100/90 border-b border-slate-200">
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
              style={{ backgroundColor: showcase.accentColor || "#4f46e5" }}
              className="px-8 py-3.5 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-sm active:scale-95 hover:opacity-95"
            >
              <span>Apri Modulo Richiesta Intervento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer con orari e contatti */}
      <PublicFooter />
    </div>
  );
}
