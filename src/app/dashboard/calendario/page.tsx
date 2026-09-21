import React from "react";
import { getServiceRequests } from "@/lib/interventions";
import { CalendarDays, Clock, MapPin, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CalendarioInterventiPage() {
  const interventions = await getServiceRequests();
  const scheduled = interventions.filter(
    (i) => i.status === "PIANIFICATO" || i.status === "IN_CORSO"
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <CalendarDays className="w-6 h-6 text-indigo-600" />
          Pianificazione & Slot Interventi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Visualizzazione cronologica degli interventi pianificati per squadra tecnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduled.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold">Nessun intervento pianificato al momento</p>
            <p className="text-xs text-slate-400 mt-1">
              Pianifica i ticket dalla panoramica interventi per vederli apparire qui.
            </p>
          </div>
        ) : (
          scheduled.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {item.serviceType}
                </span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "Da concordare"}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">{item.customerName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {item.address}
                </p>
              </div>

              {item.urgency === "EMERGENZA" && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Priorità Massima / Emergenza H24
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
