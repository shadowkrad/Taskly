import React from "react";
import AddonModuleGuard from "@/components/dashboard/AddonModuleGuard";
import { TAAAAC_ADDONS } from "@/lib/taaaac-client";
import { Award, Gift, Plus } from "lucide-react";

export default function FedeltaAddonPage() {
  return (
    <AddonModuleGuard addonId={TAAAAC_ADDONS.LOYALTY_CARD} title="Programma Fedeltà Manutenzioni">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Award className="w-6 h-6 text-indigo-600" />
              Programma Fedeltà & Punti Manutenzione
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Premia i clienti fedeli con sconti sui controlli periodici e tagliandi degli impianti.
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Nuovo Premio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-semibold text-slate-500">Tessere Attive</p>
            <p className="text-2xl font-black text-slate-900">142</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-semibold text-slate-500">Punti Erogati Questo Mese</p>
            <p className="text-2xl font-black text-indigo-600">2.840</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-semibold text-slate-500">Sconti Riscattati</p>
            <p className="text-2xl font-black text-emerald-600">28</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-4 h-4 text-indigo-600" />
            Catalogo Premi e Vantaggi Attivi
          </h2>
          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Check-up Caldaia Gratuito</p>
                <p className="text-xs text-slate-500">Al raggiungimento di 500 punti accumulati</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                500 pt
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Sconto 20% su Ricambi Climatizzatore</p>
                <p className="text-xs text-slate-500">Valido per filtri e sanificazione antibatterica</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                250 pt
              </span>
            </div>
          </div>
        </div>
      </div>
    </AddonModuleGuard>
  );
}
