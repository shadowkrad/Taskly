'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Lock, Clock } from 'lucide-react';
import { useTenant } from '@/components/tenant-provider';
import { ShowcaseConfig } from '@/lib/showcase-defaults';

interface PublicFooterProps {
  showcase?: ShowcaseConfig;
}

export function PublicFooter({ showcase }: PublicFooterProps) {
  const { config } = useTenant();
  const brandName = showcase?.brandName || config.theme.brandName || "Assistenza Tecnica & Impianti";
  const contactInfo = showcase?.contactInfo || {};

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${showcase?.sections?.showHours !== false ? "md:grid-cols-4" : "md:grid-cols-3"} gap-8 mb-8`}>
          {/* Col 1 */}
          <div className={showcase?.sections?.showHours !== false ? "md:col-span-2" : "md:col-span-2"}>
            <div className="flex items-center gap-2 mb-3 text-white font-bold text-lg">
              <span>{brandName}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              {contactInfo.brandClaim || "Servizio di pronto intervento specializzato per abitazioni, condomini e aziende. Tecnici qualificati con rilascio di dichiarazione di conformità e rapportino digitale."}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{contactInfo.guaranteeText || "Assicurazione RC Professionale e garanzia certificata sui ricambi."}</span>
            </div>
          </div>

          {/* Col 2: Orari di Presenza & Reperibilità (Condizionale da showcase.sections.showHours) */}
          {showcase?.sections?.showHours !== false && (
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showcase?.customLabels?.hoursTitle || "Reperibilità & Orari"}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>{contactInfo.hoursWeekday || "Lun - Ven: 07:30 - 19:30"}</li>
                <li>{contactInfo.hoursWeekend || "Sabato: 08:00 - 18:00"}</li>
                <li className="text-emerald-400 font-semibold">{contactInfo.hoursNote || "Pronto Intervento H24"}</li>
                {contactInfo.responseNote && (
                  <li className="text-slate-500 text-[11px]">{contactInfo.responseNote}</li>
                )}
              </ul>
            </div>
          )}

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showcase?.customLabels?.contactTitle || "Contatti & Sede"}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {(contactInfo.phone || config.contact?.phone) && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <a href={`tel:${contactInfo.phone || config.contact?.phone}`} className="hover:text-white transition-colors">
                    {contactInfo.phone || config.contact?.phone}
                  </a>
                </li>
              )}
              {(contactInfo.email || config.contact?.email) && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{contactInfo.email || config.contact?.email}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{contactInfo.address || config.contact?.address || "Sede Operativa Territoriale"}</span>
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
