import React from "react";
import { getServiceRequests } from "@/lib/interventions";
import { UserCheck, Phone, MapPin, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const interventions = await getServiceRequests();

  // Deduplicazione clienti in base al numero di telefono
  const clientsMap = new Map<string, { name: string; phone: string; address: string; count: number }>();
  for (const item of interventions) {
    const key = item.phone.trim();
    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        name: item.customerName,
        phone: item.phone,
        address: item.address,
        count: 1,
      });
    } else {
      const existing = clientsMap.get(key)!;
      existing.count += 1;
    }
  }

  const clients = Array.from(clientsMap.values());

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-indigo-600" />
          Anagrafica Clienti & Contratti
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Elenco clienti serviti, indirizzi di fornitura e frequenza interventi di manutenzione.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold">Nessun cliente in archivio</p>
            <p className="text-xs text-slate-400 mt-1">
              I clienti verranno automaticamente registrati al ricevimento di prenotazioni e richieste di assistenza.
            </p>
          </div>
        ) : (
          clients.map((c, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  {c.count} {c.count === 1 ? "intervento" : "interventi"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {c.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {c.address}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
