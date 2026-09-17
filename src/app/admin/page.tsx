import React from 'react';
import { getServiceRequests } from '@/lib/interventions';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { Wrench, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const interventions = await getServiceRequests();

  // Serializzazione date per Client Component
  const safeInterventions = interventions.map((item) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
    workReports: item.workReports?.map((r) => ({
      ...r,
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
    })),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Torna alla Vetrina
            </Link>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Shield className="w-3 h-3" />
              Sessione Sicura Tenant
            </span>
          </div>

          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-indigo-600 shrink-0" />
            Gestionale Interventi & Rapportini
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pannello operativo per pianificazione interventi, gestione emergenze ed emissione rapportini digitali con firma.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#prenota"
            className="btn-taaaac px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            + Nuova Prenotazione
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Dashboard Principale */}
      <AdminDashboard initialInterventions={safeInterventions} />
    </div>
  );
}
