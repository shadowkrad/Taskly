'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from './tenant-provider';
import { Wrench, Phone, MessageSquare, ExternalLink, ArrowLeft } from 'lucide-react';
import { LogoutButton } from './admin/LogoutButton';

export function Navbar() {
  const { config } = useTenant();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/tasks');
  const isLoginPage = pathname === '/login';

  // Se siamo all'interno di /dashboard, la navigazione è gestita interamente da DashboardSidebar
  if (isDashboard) {
    return null;
  }

  // 1. Navbar per la Dashboard di Gestione Riservata (Tecnico Autenticato)
  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-base">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white tracking-tight text-base">
                    {config.theme.brandName || 'Taskly'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    GESTIONALE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Pannello Tecnico & Rapportini</p>
              </div>
            </Link>
          </div>

          {/* Navigazione Gestionale */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/admin'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interventi & Agenda
            </Link>
            <Link
              href="/tasks"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/tasks'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Attività Interne
            </Link>
          </nav>

          {/* Azioni Tecnico: Vedi Vetrina + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              title="Apri la vetrina pubblica cliente in una nuova scheda"
            >
              <span>Vedi Vetrina</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
    );
  }

  // 2. Navbar minimale per la pagina di Login
  if (isLoginPage) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-base">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              {config.theme.brandName || 'Taskly'} <span className="text-indigo-600">PRO</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Torna alla Vetrina
          </Link>
        </div>
      </header>
    );
  }

  // 3. Navbar 100% PUBBLICA per i Clienti della Vetrina (Come su Schedly: NESSUN tasto login/gestionale)
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

        {/* Menu Navigazione Vetrina Cliente */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#servizi" className="hover:text-indigo-600 transition-colors">
            I Nostri Servizi
          </a>
          <a href="#prenota" className="hover:text-indigo-600 transition-colors">
            Richiedi Intervento
          </a>
        </nav>

        {/* Contatti Rapidi e Reperibilità Live (Solo per i clienti) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://wa.me/393401234567?text=Salve,%20ho%20bisogno%20di%20un%20intervento"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href="tel:+393401234567"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Chiama Subito</span>
          </a>
        </div>
      </div>
    </header>
  );
}
