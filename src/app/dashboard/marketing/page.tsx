import React from "react";
import AddonModuleGuard from "@/components/dashboard/AddonModuleGuard";
import { TAAAAC_ADDONS } from "@/lib/taaaac-client";
import { Megaphone, Send } from "lucide-react";

export default function MarketingAddonPage() {
  return (
    <AddonModuleGuard addonId={TAAAAC_ADDONS.MARKETING_1CLICK} title="Marketing & Campagne SMS/Email">
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-indigo-600" />
            Marketing 1-Click & Promemoria Revisioni
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Invia promemoria automatici ai clienti per il rinnovo libretto d&apos;impianto, tagliandi stagionali e offerte.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Invia Nuova Campagna Rapida</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destinatari
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">
                <option>Tutti i clienti con revisione caldaia scaduta (84)</option>
                <option>Clienti con climatizzatori installati &gt; 1 anno (112)</option>
                <option>Tutti i clienti registrati (320)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Testo Messaggio SMS / WhatsApp
              </label>
              <textarea
                rows={3}
                defaultValue="Gentile cliente, ti ricordiamo che è tempo del controllo fumi e bollino della tua caldaia. Prenota subito il tuo intervento su taskly.taaaac.eu!"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Invia Campagna Ora
            </button>
          </div>
        </div>
      </div>
    </AddonModuleGuard>
  );
}
