'use client';

import React from 'react';
import { useTenant } from './tenant-provider';
import { 
  CheckCircle2, 
  Layers, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Database, 
  ShieldCheck, 
  Palette
} from 'lucide-react';

export function TenantSidebar() {
  const { config } = useTenant();

  const addonIcons: Record<string, React.ReactNode> = {
    WHATSAPP_REMINDERS: <MessageSquare className="w-4 h-4 text-emerald-600" />,
    TASKLY_AUTOMATIONS: <Zap className="w-4 h-4 text-amber-500" />,
    ADVANCED_REPORTS: <BarChart3 className="w-4 h-4 text-indigo-500" />,
  };

  const addonNames: Record<string, string> = {
    WHATSAPP_REMINDERS: 'Promemoria WhatsApp',
    TASKLY_AUTOMATIONS: 'Automazioni Taskly',
    ADVANCED_REPORTS: 'Report & Analisi Avanzate',
    LOYALTY_CARD: 'Loyalty Program',
    VENDOLY_CHANNEL_MANAGER: 'Vendoly Channel Manager',
  };

  return (
    <aside className="space-y-5">
      {/* Scheda Tenant & Licenza */}
      <div className="card-taaaac space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stato Modulo Taaaac
            </h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            {config.licenseStatus}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-slate-400">Dominio:</span>
            <span className="font-mono font-medium text-slate-800">{config.domain}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-slate-400">Scadenza Licenza:</span>
            <span className="font-medium text-slate-800">{config.licenseExpiry || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-slate-400">Tipo Storage:</span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-800">
              <Database className="w-3 h-3 text-slate-500" /> SQLite Isolato
            </span>
          </div>
        </div>
      </div>

      {/* Scheda Moduli Add-on Abilitati */}
      <div className="card-taaaac space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Add-on Abilitati
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {config.addons.length} attivi
          </span>
        </div>

        <div className="space-y-2">
          {config.addons.map((addon) => (
            <div
              key={addon}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                  {addonIcons[addon] || <Zap className="w-4 h-4 text-slate-600" />}
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {addonNames[addon] || addon}
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}

          {config.addons.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              Nessun modulo add-on opzionale attivo.
            </p>
          )}
        </div>
      </div>

      {/* Scheda Brand & Palette Dinamica */}
      <div className="card-taaaac space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Palette className="w-4 h-4 text-slate-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Brand Theme
          </h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Colore Primario:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-md shadow-2xs border border-slate-200"
                style={{ backgroundColor: config.theme.primaryColor }}
              />
              <span className="font-mono text-slate-700 font-medium">{config.theme.primaryColor}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Colore Accento:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-md shadow-2xs border border-slate-200"
                style={{ backgroundColor: config.theme.accentColor }}
              />
              <span className="font-mono text-slate-700 font-medium">{config.theme.accentColor}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
