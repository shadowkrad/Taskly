'use client';

import React, { useState, useTransition } from 'react';
import {
  X,
  FileCheck,
  Clock,
  Euro,
  Wrench,
  CreditCard,
  UserCheck,
  Loader2,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { createWorkReport } from '@/app/actions/interventions';
import type { ServiceRequestItem } from '@/lib/interventions';

interface WorkReportModalProps {
  intervention: ServiceRequestItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function WorkReportModal({ intervention, onClose, onSuccess }: WorkReportModalProps) {
  const existingReport = intervention.workReports && intervention.workReports.length > 0
    ? intervention.workReports[0]
    : null;

  const [isPending, startTransition] = useTransition();
  const [hoursWorked, setHoursWorked] = useState<number>(existingReport?.hoursWorked || 1.5);
  const [hourlyRate, setHourlyRate] = useState<number>(existingReport?.hourlyRate || 45.0);
  const [materialsCost, setMaterialsCost] = useState<number>(0);
  const [materialsUsed, setMaterialsUsed] = useState<string>(
    existingReport?.materialsUsed || 'Raccordi idraulici, guarnizioni tenuta, sigillante professionale'
  );
  const [paymentStatus, setPaymentStatus] = useState<'DA_PAGARE' | 'SALDATO'>(
    (existingReport?.paymentStatus as 'DA_PAGARE' | 'SALDATO') || 'SALDATO'
  );
  const [paymentMethod, setPaymentMethod] = useState<'CONTANTI' | 'POS' | 'BONIFICO'>(
    (existingReport?.paymentMethod as 'CONTANTI' | 'POS' | 'BONIFICO') || 'POS'
  );
  const [customerSignature, setCustomerSignature] = useState<string>(
    existingReport?.customerSignature || intervention.customerName
  );
  const [technicianNotes, setTechnicianNotes] = useState<string>(
    existingReport?.technicianNotes || 'Collaudo effettuato con successo. Nessuna perdita residua rilevata.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const calculatedTotal = Number((hoursWorked * hourlyRate + materialsCost).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingReport) return; // già salvato in sola lettura

    setErrorMsg(null);
    startTransition(async () => {
      const res = await createWorkReport({
        serviceRequestId: intervention.id,
        hoursWorked,
        hourlyRate,
        materialsUsed: materialsUsed ? `${materialsUsed} (Ricambi: €${materialsCost})` : '',
        customerSignature,
        totalAmount: calculatedTotal,
        paymentStatus,
        paymentMethod,
        technicianNotes,
      });

      if (res.success) {
        setSuccessMsg('Rapportino registrato con successo!');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/60 text-white">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {existingReport ? 'Rapportino Digitale Intervento' : 'Nuovo Rapportino Tecnico'}
              </h3>
              <p className="text-xs text-slate-300">
                Ticket #{intervention.id.slice(-8).toUpperCase()} • {intervention.customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900">{intervention.serviceType}</span>
              <p className="text-slate-500 mt-0.5">{intervention.address}</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="font-medium text-slate-500">Tel:</span>{' '}
              <a href={`tel:${intervention.phone}`} className="font-bold text-indigo-600 hover:underline">
                {intervention.phone}
              </a>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* Manodopera: Ore & Tariffa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Ore Lavorate (h)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="40"
                disabled={!!existingReport}
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-indigo-600" />
                Tariffa Oraria (€/h)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                disabled={!!existingReport}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Materiali & Ricambi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                Materiali & Ricambi Impiegati
              </label>
              <input
                type="text"
                disabled={!!existingReport}
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="Es. Valvola di sicurezza, raccordi ottone..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Costo Ricambi (€)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                disabled={!!existingReport}
                value={materialsCost}
                onChange={(e) => setMaterialsCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Totale Calcolato */}
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/90 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Totale Complessivo Intervento
              </span>
              <p className="text-[11px] text-indigo-700">
                Manodopera: €{(hoursWorked * hourlyRate).toFixed(2)} + Ricambi: €{materialsCost.toFixed(2)}
              </p>
            </div>
            <div className="text-2xl font-black text-indigo-900">
              €{existingReport ? existingReport.totalAmount.toFixed(2) : calculatedTotal.toFixed(2)}
            </div>
          </div>

          {/* Pagamento & Modalità */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                Stato Pagamento
              </label>
              <select
                disabled={!!existingReport}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'DA_PAGARE' | 'SALDATO')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-100"
              >
                <option value="SALDATO">Saldato sul posto</option>
                <option value="DA_PAGARE">Da Saldare / Fattura</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Modalità di Incasso
              </label>
              <select
                disabled={!!existingReport}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'CONTANTI' | 'POS' | 'BONIFICO')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-100"
              >
                <option value="POS">POS / Carta di Credito</option>
                <option value="CONTANTI">Contanti</option>
                <option value="BONIFICO">Bonifico Bancario</option>
              </select>
            </div>
          </div>

          {/* Firma Cliente & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                Firma / Conferma Cliente
              </label>
              <input
                type="text"
                disabled={!!existingReport}
                value={customerSignature}
                onChange={(e) => setCustomerSignature(e.target.value)}
                placeholder="Nome firmatario cliente"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Note Tecniche / Certificato
              </label>
              <input
                type="text"
                disabled={!!existingReport}
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="Es. Pressione impianto 1.5 bar, prova tenuta ok"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-taaaac px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Stampa / PDF
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-taaaac px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
              >
                Chiudi
              </button>

              {!existingReport && (
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-taaaac px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5" />
                      Emetti e Salva Rapportino
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
