import React from "react";
import Link from "next/link";
import { BookingForm } from "@/components/public/BookingForm";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ArrowLeft, Wrench, Shield, PhoneCall } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PrenotazioneInterventoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Mini Header Nav */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla Vetrina
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Shield className="w-3.5 h-3.5" />
            <span>Pronto Intervento Certificato H24</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Richiesta Intervento Tecnico
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Compila i dettagli del guasto o della manutenzione richiesta. Verrai contattato tempestivamente da un tecnico reperibile.
          </p>
        </div>

        {/* Form di Prenotazione / Urgenze */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90">
          <BookingForm />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
