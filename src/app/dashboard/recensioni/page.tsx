import React from "react";
import AddonModuleGuard from "@/components/dashboard/AddonModuleGuard";
import { TAAAAC_ADDONS } from "@/lib/taaaac-client";
import { Star, MessageSquare, ExternalLink } from "lucide-react";

export default function RecensioniAddonPage() {
  const reviews = [
    {
      id: "1",
      author: "Matteo Bianchi",
      rating: 5,
      date: "Ieri",
      text: "Intervento tempestivo per perdita d'acqua in bagno. Tecnico gentilissimo e rapportino digitale firmato subito su tablet. Consigliatissimo!",
    },
    {
      id: "2",
      author: "Laura Neri",
      rating: 5,
      date: "3 giorni fa",
      text: "Revisione caldaia eseguita a regola d'arte con rilascio bollino. Grande professionalità.",
    },
  ];

  return (
    <AddonModuleGuard addonId={TAAAAC_ADDONS.GOOGLE_REVIEWS} title="Recensioni Google & Feedback">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              Recensioni Google & Reputazione
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Raccogli feedback automatici via SMS o WhatsApp dopo ogni rapportino chiuso.
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto">
            <ExternalLink className="w-4 h-4" />
            Configura Scheda Google
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{r.author}</h3>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 italic">&quot;{r.text}&quot;</p>
              <p className="text-[10px] text-slate-400">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </AddonModuleGuard>
  );
}
