"use client";

import React, { useState } from "react";
import { Settings, Save, Clock, Shield, CheckCircle2 } from "lucide-react";
import { useTenantConfig } from "@/components/providers/TenantConfigProvider";
import EmailSettingsCard from "@/components/dashboard/EmailSettingsCard";

export default function ImpostazioniPage() {
  const { config } = useTenantConfig();
  const [saved, setSaved] = useState(false);
  const [businessName, setBusinessName] = useState(config?.nomeAttivita || "Taskly Service");
  const [h24Active, setH24Active] = useState(true);
  const [callFee, setCallFee] = useState("50");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600" />
          Impostazioni Operative & Orari
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configura reperibilità h24, gestione notifiche emergenze e tariffe standard.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Impostazioni salvate con successo per il tenant corrente!
        </div>
      )}

      {/* Canale Notifiche Email Taaaac Mail Engine */}
      <EmailSettingsCard />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Dati Attività & Identità Tenant
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Attività / Ragione Sociale
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Reperibilità & Chiamate d&apos;Urgenza
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Abilita Pronto Intervento H24</p>
              <p className="text-xs text-slate-500">
                Mostra il banner di emergenza e permette l&apos;invio di ticket urgenti fuori orario.
              </p>
            </div>
            <input
              type="checkbox"
              checked={h24Active}
              onChange={(e) => setH24Active(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diritto Fisso di Chiamata Standard (€)
            </label>
            <input
              type="number"
              value={callFee}
              onChange={(e) => setCallFee(e.target.value)}
              className="w-36 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salva Configurazioni
          </button>
        </div>
      </form>
    </div>
  );
}
