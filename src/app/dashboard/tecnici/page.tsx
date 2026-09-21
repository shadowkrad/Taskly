import React from "react";
import { Users, Phone, MapPin, CheckCircle, ShieldCheck } from "lucide-react";

export default function TecniciPage() {
  const technicians = [
    {
      id: "1",
      name: "Marco Rossi",
      role: "Tecnico Senior Termoidraulica",
      phone: "+39 340 1234567",
      status: "DISPONIBILE",
      van: "Fiat Fiorino - AB123CD",
      zone: "Zona Nord / Centro",
    },
    {
      id: "2",
      name: "Andrea Bianchi",
      role: "Specialista Impianti Elettrici & Clima",
      phone: "+39 349 9876543",
      status: "IN_INTERVENTO",
      van: "Renault Kangoo - EF456GH",
      zone: "Zona Sud / Periferia",
    },
    {
      id: "3",
      name: "Luca Verdi",
      role: "Tecnico Assistenza Caldaie",
      phone: "+39 333 4567890",
      status: "REPERIBILE",
      van: "Ford Transit - IL789MN",
      zone: "Tutta la Provincia (H24)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-indigo-600" />
          Squadra Tecnici & Mezzi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Anagrafica tecnici abilitati, reperibilità sul campo e automezzi assegnati.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  t.status === "DISPONIBILE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : t.status === "IN_INTERVENTO"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {t.status === "DISPONIBILE"
                  ? "Disponibile"
                  : t.status === "IN_INTERVENTO"
                  ? "Su Intervento"
                  : "Reperibile H24"}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">{t.name}</h3>
              <p className="text-xs text-indigo-600 font-medium">{t.role}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {t.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {t.zone}
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Furgone: {t.van}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
