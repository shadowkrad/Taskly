'use client';

import React from 'react';
import { useTenant } from './tenant-provider';
import { CheckCircle, ShieldCheck, Sparkles, ExternalLink, Layers } from 'lucide-react';

export function Navbar() {
  const { config, isLicenseActive } = useTenant();

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs font-bold text-lg brand-bg"
          >
            {config.theme.clientLogo ? (
              <img src={config.theme.clientLogo} alt={config.theme.brandName} className="w-7 h-7 object-contain" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                {config.theme.brandName}
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {config.domain}
            </p>
          </div>
        </div>

        {/* Status Pills & Core Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge Stato Licenza Taaaac */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">Licenza {config.licenseStatus}</span>
          </div>

          {/* Collegamento Taaaac Core */}
          <a
            href="https://taaaac.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 transition-all cursor-pointer"
          >
            <span>Taaaac Core</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
