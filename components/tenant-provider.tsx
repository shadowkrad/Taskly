'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { TenantConfig, TaaaacAddon } from '@/lib/taaaac';
import { AlertTriangle, ShieldAlert, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface TenantContextType {
  config: TenantConfig;
  hasAddon: (addon: TaaaacAddon) => boolean;
  isLicenseActive: boolean;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function TenantProvider({
  config,
  children,
}: {
  config: TenantConfig;
  children: React.ReactNode;
}) {
  const hasAddon = (addon: TaaaacAddon) => {
    return config.addons.includes(addon);
  };

  const isLicenseActive = config.licenseStatus === 'ATTIVO';

  // Stile CSS dinamico per i colori del brand del cliente
  const brandStyles = useMemo(() => {
    return {
      '--color-brand-primary': config.theme.primaryColor,
      '--color-brand-accent': config.theme.accentColor,
    } as React.CSSProperties;
  }, [config.theme]);

  // Se la licenza è sospesa, mostra schermata di blocco elegante
  if (config.licenseStatus === 'SOSPESO') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 max-w-md w-full shadow-xs text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Licenza Sospesa</h1>
            <p className="text-sm text-slate-500">
              L'istanza per <strong>{config.domain}</strong> risulta momentaneamente non attiva sulla console centrale Taaaac Core.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            Per riattivare l'accesso, accedi alla dashboard di gestione o contatta il supporto Taaaac.
          </div>
          <a
            href="https://taaaac.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all cursor-pointer text-sm"
          >
            Vai su Taaaac Core <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ config, hasAddon, isLicenseActive }}>
      <div style={brandStyles} className="min-h-screen flex flex-col">
        {/* Banner licenza in scadenza */}
        {config.licenseStatus === 'IN_SCADENZA' && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto max-w-7xl w-full">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Attenzione:</strong> La licenza di questo applicativo è in scadenza {config.licenseExpiry ? `(il ${config.licenseExpiry})` : ''}.
              </span>
              <a
                href="https://taaaac.eu/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto underline font-medium hover:text-amber-900 inline-flex items-center gap-1"
              >
                Rinnova licenza <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
        {children}
      </div>
    </TenantContext.Provider>
  );
}
