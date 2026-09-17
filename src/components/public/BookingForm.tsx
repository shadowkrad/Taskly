'use client';

import React, { useState, useTransition } from 'react';
import {
  Phone,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { createServiceRequest } from '@/app/actions/interventions';
import type { ServiceRequestInput } from '@/lib/validations';

const SERVICE_OPTIONS = [
  'Idraulica & Disostruzioni',
  'Impianti Elettrici & Salvavita',
  'Caldaie, Scaldabagni & Clima',
  'Fabbro & Serrature Blindate',
  'Montaggi & Riparazioni Generali',
  'Altro Intervento Tecnico',
];

const TIME_OPTIONS = [
  'Prima possibile (Urgente)',
  'Mattina (08:30 - 12:30)',
  'Pomeriggio (14:00 - 18:00)',
  'Tardo Pomeriggio (18:00 - 20:00)',
  'Concordare telefonicamente',
];

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [urgency, setUrgency] = useState<'ORDINARIO' | 'URGENTE' | 'EMERGENZA'>('ORDINARIO');
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0]);
  const [preferredTime, setPreferredTime] = useState(TIME_OPTIONS[0]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; ticketId?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setStatusMessage(null);

    const payload: ServiceRequestInput = {
      customerName,
      phone,
      email: email || undefined,
      address,
      serviceType,
      description,
      urgency,
      preferredTime,
    };

    startTransition(async () => {
      const res = await createServiceRequest(payload);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message,
          ticketId: res.data?.id,
        });
        // Reset form
        setDescription('');
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message,
        });
        if (res.errors) {
          setFormErrors(res.errors);
        }
      }
    });
  };

  return (
    <section id="prenota" className="py-14 sm:py-18 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/70">
            Richiesta Diretta Senza Impegno
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Richiedi un Intervento o Preventivo Rapido
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Compila il modulo indicando l&apos;urgenza: riceverai una conferma telefonica entro pochi minuti.
          </p>
        </div>

        {statusMessage?.type === 'success' ? (
          <div className="card-taaaac bg-white p-8 text-center border-emerald-300 shadow-md">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Richiesta Ricevuta!</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm sm:text-base">
              {statusMessage.text}
            </p>
            {statusMessage.ticketId && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block text-xs font-mono text-slate-600">
                Codice Intervento: <strong>#{statusMessage.ticketId.slice(-8).toUpperCase()}</strong>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:+393401234567"
                className="btn-taaaac px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Hai fretta? Chiama subito
              </a>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="btn-taaaac px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm"
              >
                Invia un&apos;altra richiesta
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-taaaac bg-white p-6 sm:p-8 shadow-sm">
            {statusMessage?.type === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{statusMessage.text}</p>
                </div>
              </div>
            )}

            {/* 1. Selezione Livello Urgenza */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                1. Seleziona il livello di urgenza
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('ORDINARIO')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'ORDINARIO'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">🟢 Ordinario</span>
                    <span className="text-[10px] font-semibold text-slate-500">Standard</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Intervento entro 2-3 giorni lavorativi.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('URGENTE')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'URGENTE'
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-900">🟡 Urgente</span>
                    <span className="text-[10px] font-semibold text-amber-700">Entro 24h</span>
                  </div>
                  <p className="text-xs text-amber-800/80 mt-1">Priorità alta, intervento entro 24 ore.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('EMERGENZA')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'EMERGENZA'
                      ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-900">🔴 Emergenza 24h</span>
                    <span className="text-[10px] font-semibold text-rose-700">60 Minuti</span>
                  </div>
                  <p className="text-xs text-rose-800/80 mt-1">Allagamenti, guasti gravi, porte bloccate.</p>
                </button>
              </div>
            </div>

            {/* 2. Categoria e Orario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Tipo di intervento
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Orario preferito
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Descrizione Guasto */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Descrivi il problema o la richiesta *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Es: Ho una perdita sotto il lavello che perde acqua quando apro il rubinetto..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.description ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 bg-white'
                }`}
              />
              {formErrors.description && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.description[0]}</p>
              )}
            </div>

            {/* 4. Dati Contatto & Indirizzo */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                4. I tuoi recapiti per il sopralluogo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nome e Cognome *"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.customerName ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.customerName && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.customerName[0]}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Cellulare per contatto rapido *"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.phone[0]}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Indirizzo completo (Via, Civico, Città) *"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.address ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.address && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.address[0]}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email per ricevuta (opzionale)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Invia Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dati trattati solo per l&apos;intervento nel rispetto del GDPR.
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-taaaac w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Invia Richiesta di Intervento
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
