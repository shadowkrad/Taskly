import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Lock } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-white font-bold text-lg">
              <span>Taskly Pro</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Taaaac Vertical
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Servizio di pronto intervento specializzato per abitazioni, condomini e aziende.
              Tecnici qualificati abilitati D.M. 37/08 con rilascio di dichiarazione di conformità e rapportino digitale.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Assicurazione RC Professionale e garanzia certificata sui ricambi.
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Reperibilità</h4>
            <ul className="space-y-2 text-xs">
              <li>Lun - Ven: 07:30 - 19:30</li>
              <li>Sabato: 08:00 - 18:00</li>
              <li className="text-emerald-400 font-semibold">Pronto Intervento: 24h / 7 giorni</li>
              <li>Interventi rapidi entro 60 min</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Contatti & Sede</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <a href="tel:+393401234567" className="hover:text-white transition-colors">
                  +39 340 1234567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>assistenza@taskly.taaaac.eu</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Via dell&apos;Artigianato 10, Milano</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  Area Riservata Tecnico
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Taskly — Modulo dell&apos;ecosistema Taaaac. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Termini di Servizio</span>
            <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Dashboard Operativa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
