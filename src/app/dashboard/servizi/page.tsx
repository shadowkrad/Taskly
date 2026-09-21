import React from "react";
import { Layers, Euro, Clock, AlertTriangle } from "lucide-react";

export default function ServiziPage() {
  const services = [
    {
      id: "1",
      title: "Pronto Intervento Idraulico H24",
      description: "Perdite d'acqua, allagamenti, rottura tubature e spurghi urgenti.",
      basePrice: "€ 80,00",
      hourlyRate: "€ 45,00 / ora",
      isEmergency: true,
    },
    {
      id: "2",
      title: "Manutenzione & Revisione Caldaia",
      description: "Controllo fumi, pulizia bruciatore, bollino verde e rilascio libretto d'impianto.",
      basePrice: "€ 90,00",
      hourlyRate: "Incluso nel forfait",
      isEmergency: false,
    },
    {
      id: "3",
      title: "Riparazione Guasto Elettrico",
      description: "Cortocircuito, ripristino salvavita, controllo quadro elettrico e dispersioni.",
      basePrice: "€ 70,00",
      hourlyRate: "€ 40,00 / ora",
      isEmergency: true,
    },
    {
      id: "4",
      title: "Installazione / Sanificazione Climatizzatore",
      description: "Ricarica gas refrigerante, pulizia filtri antibatterica e verifica rendimento.",
      basePrice: "€ 60,00",
      hourlyRate: "€ 40,00 / ora",
      isEmergency: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-indigo-600" />
          Listino Prestazioni & Tariffe
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configurazione servizi di assistenza tecnica, diritti di chiamata e tariffe orarie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.description}</p>
              </div>
              {s.isEmergency && (
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Emergenza
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Diritto chiamata: {s.basePrice}</span>
              <span className="text-indigo-600 font-bold">{s.hourlyRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
