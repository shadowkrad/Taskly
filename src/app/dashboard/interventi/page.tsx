import React from "react";
import { getServiceRequests } from "@/lib/interventions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InterventiPage() {
  const interventions = await getServiceRequests();

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
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-indigo-600" />
          Interventi & Ticket Operativi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gestione delle chiamate tecniche, assegnazione stati e prioritizzazione emergenze.
        </p>
      </div>

      <AdminDashboard initialInterventions={safeInterventions} />
    </div>
  );
}
