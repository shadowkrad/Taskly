'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Lock } from 'lucide-react';
import { useTenant } from '@/components/tenant-provider';

export function PublicFooter() {
  const { config } = useTenant();
  const brandName = config.theme.brandName || "Assistenza Tecnica & Impianti";

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-white font-bold text-lg">
              <span>{brandName}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Servizio di pronto intervento specializzato per abitazioni, condomini e aziende.
              Tecnici qualificati con rilascio di dichiarazione di conformità e rapportino digitale.
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
              <li className="text-emerald-400 font-semibold">Pronto Intervento H24</li>
              <li>Interventi tempestivi in loco</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Contatti</h4>
            <ul className="space-y-2 text-xs">
              {config.contact?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <a href={`tel:${config.contact.phone}`} className="hover:text-white transition-colors">
                    {config.contact.phone}
                  </a>
                </li>
              )}
              {config.contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{config.contact.email}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sede Operativa Territoriale</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} {brandName}. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Area Riservata Staff</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
