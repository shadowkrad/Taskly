'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from './tenant-provider';
import { Wrench, ClipboardList, Phone, ExternalLink } from 'lucide-react';

export function Navbar() {
  const { config } = useTenant();
  const pathname = usePathname();

  const isPublic = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs font-bold text-lg brand-bg group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  {config.theme.brandName || 'Taskly'}
                </span>
                <span className="inline-flex text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Pronto Intervento & Assistenza Tecnica
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              isPublic
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vetrina & Prenotazioni
          </Link>
          <Link
            href="/admin"
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Gestionale Interventi
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Call Button */}
          <a
            href="tel:+393401234567"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiama 24/7</span>
          </a>

          {/* Admin link on mobile */}
          <Link
            href={isAdmin ? '/' : '/admin'}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
          >
            {isAdmin ? 'Vetrina' : 'Area Tecnico'}
          </Link>

          {/* Badge Licenza Taaaac */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Taaaac Core</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
