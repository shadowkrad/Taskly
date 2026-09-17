'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Lock, Wrench } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Taskly</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Pronto Intervento & Manutenzioni</p>
          </div>
        </div>

        {/* Live Badge & Direct Call */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pronto Intervento Attivo 24/7
          </div>

          <a
            href="tel:+393401234567"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Chiama Subito</span>
            <span className="sm:hidden">Chiama</span>
          </a>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            title="Area Riservata Tecnico"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Area Tecnico</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
