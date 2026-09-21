import React from "react";
import { getServiceRequests } from "@/lib/interventions";
import { FileCheck2, Euro, CheckCircle2, User, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RapportiniPage() {
  const interventions = await getServiceRequests();
  const reportedInterventions = interventions.filter(
    (i) => i.workReports && i.workReports.length > 0
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <FileCheck2 className="w-6 h-6 text-indigo-600" />
          Rapportini Digitali & Firme
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Archivio dei rapportini di lavoro firmati digitalmente dai clienti, ore impiegate e materiali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportedInterventions.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold">Nessun rapportino emesso finora</p>
            <p className="text-xs text-slate-400 mt-1">
              Dalla pagina Interventi, clicca su &quot;Emetti Rapportino&quot; per redigere il consuntivo con firma digitale.
            </p>
          </div>
        ) : (
          reportedInterventions.map((item) => {
            const report = item.workReports?.[0];
            if (!report) return null;
            return (
              <div
                key={report.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Firmato
                  </span>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                    <Euro className="w-3.5 h-3.5 text-emerald-600" />
                    {report.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">{item.customerName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {report.technicianNotes || "Intervento completato regolarmente."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {report.hoursWorked}h lavoro
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Firma acquisita
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
