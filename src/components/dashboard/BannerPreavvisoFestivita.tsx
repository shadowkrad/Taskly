"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Calendar, Sparkles, ArrowRight, Clock, Wrench } from "lucide-react";
import type { PreavvisoFestivita } from "@/lib/festivita-italiane";

interface Props {
  festivita: PreavvisoFestivita[];
}

export default function BannerPreavvisoFestivita({ festivita }: Props) {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("taskly_dismissed_festivita");
      if (stored) {
        setDismissed(JSON.parse(stored));
      }
    } catch {
      // Ignora errori storage
    }
  }, []);

  const handleDismiss = (dataStr: string) => {
    const updated = { ...dismissed, [dataStr]: true };
    setDismissed(updated);
    try {
      sessionStorage.setItem("taskly_dismissed_festivita", JSON.stringify(updated));
    } catch {
      // Ignora errori storage
    }
  };

  const attive = festivita.filter((f) => !dismissed[f.data]);
  if (attive.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {attive.map((item) => {
        const isChiuso = !item.isLavorativo;
        const giorniLabel =
          item.giorniMancanti === 0
            ? "Oggi"
            : item.giorniMancanti === 1
            ? "Domani"
            : `Tra ${item.giorniMancanti} giorni`;

        return (
          <div
            key={item.data}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
              isChiuso
                ? "bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 border-amber-300 bg-white"
                : "bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-amber-500/10 border-indigo-300 bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0 pr-8 md:pr-0">
                {/* Badge Festività & Giorni Mancanti */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isChiuso
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : "bg-indigo-100 text-indigo-900 border border-indigo-200"
                    }`}
                  >
                    <span>{isChiuso ? "🎄 Festività in Arrivo" : "✨ Reperibilità Straordinaria Attiva"}</span>
                    <span>•</span>
                    <span className="font-bold">{giorniLabel}</span>
                  </span>

                  <span className="text-xs font-bold text-slate-800 capitalize flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {item.dataFormattata}
                  </span>
                </div>

                {/* Titolo e descrizione chiara */}
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span>{item.nome}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {isChiuso ? (
                    <>
                      In questa data il servizio ordinario risulterà <strong className="text-rose-600">chiuso</strong> e le pianificazioni standard saranno sospese. Desideri configurare un turno di reperibilità straordinaria per emergenze (pronto intervento festivo a tariffa dedicata) o confermare la chiusura per ferie?
                    </>
                  ) : (
                    <>
                      Hai configurato una <strong>Reperibilità Straordinaria</strong>{" "}
                      {item.orario && <span className="font-mono text-indigo-700 font-bold">({item.orario})</span>}: i tecnici sono operativi e i ticket urgenti possono essere pianificati regolarmente.
                    </>
                  )}
                </p>
              </div>

              {/* Azioni & CTA */}
              <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                <Link
                  href="/dashboard/orari?tab=festivita"
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95 ${
                    isChiuso
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isChiuso ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Configura Turni & Festività</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Gestisci Orari</span>
                    </>
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDismiss(item.data)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="Nascondi promemoria"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
