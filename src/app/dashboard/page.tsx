import React from "react";
import { getServiceRequests } from "@/lib/interventions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Wrench, Shield, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
    <div className="space-y-6">
      {/* Header Panoramica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              <Shield className="w-3 h-3" />
              Sessione Operativa Protetta
            </span>
          </div>

          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-indigo-600 shrink-0" />
            Panoramica Interventi & Assistenza
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controllo tempestivo emergenze, assegnazione squadre e monitoraggio avanzamento ticket.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#prenota"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nuovo Ticket
          </Link>
        </div>
      </div>

      {/* Dashboard Principale con filtri, metriche e rapportini */}
      <AdminDashboard initialInterventions={safeInterventions} />
    </div>
  );
}
