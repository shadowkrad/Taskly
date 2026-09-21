"use client";

import React, { useState, useTransition } from "react";
import {
  Wrench,
  Zap,
  Flame,
  KeyRound,
  Hammer,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { createServiceRequest } from "@/app/actions/interventions";
import type { ServiceRequestInput } from "@/lib/validations";

const SERVICE_OPTIONS = [
  {
    title: "Idraulica & Disostruzioni",
    desc: "Perdite d'acqua, scarichi intasati, sanitari e sifoni",
    icon: Wrench,
    type: "Idraulica",
  },
  {
    title: "Impianti Elettrici & Salvavita",
    desc: "Cortocircuiti, salvavita scattato, quadri elettrici e prese",
    icon: Zap,
    type: "Elettrico",
  },
  {
    title: "Caldaie, Scaldabagni & Clima",
    desc: "Blocco caldaia, controllo fumi, ricarica gas e split clima",
    icon: Flame,
    type: "Caldaie & Clima",
  },
  {
    title: "Fabbro & Serrature Blindate",
    desc: "Apertura porte senza scasso, chiavi spezzate, cilindro europeo",
    icon: KeyRound,
    type: "Serrature & Fabbro",
  },
  {
    title: "Montaggi & Riparazioni Generali",
    desc: "Tapparelle, infissi, mensole, mobili e piccole riparazioni",
    icon: Hammer,
    type: "Riparazioni Generali",
  },
  {
    title: "Altro Intervento Tecnico",
    desc: "Richiesta personalizzata per manutenzione impianti",
    icon: Wrench,
    type: "Altro",
  },
];

const TIME_OPTIONS = [
  "Prima possibile (Emergenza)",
  "Mattina (08:30 - 12:30)",
  "Pomeriggio (14:00 - 18:00)",
  "Tardo Pomeriggio (18:00 - 20:00)",
  "Da concordare telefonicamente",
];

const STEPS = ["Tipo Guasto", "Urgenza & Orario", "Luogo Intervento", "I tuoi dati", "Riepilogo"];

export function BookingForm() {
  const [step, setStep] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // Step 0: Tipo Guasto
  const [serviceType, setServiceType] = useState<string>(SERVICE_OPTIONS[0].title);

  // Step 1: Urgenza & Orario
  const [urgency, setUrgency] = useState<"ORDINARIO" | "URGENTE" | "EMERGENZA">("ORDINARIO");
  const [preferredTime, setPreferredTime] = useState<string>(TIME_OPTIONS[0]);

  // Step 2: Indirizzo e Descrizione
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Step 3: Dati Contatto
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);

  // Stato Risultato
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; ticketId?: string } | null>(null);

  const goNext = () => {
    setErrorMsg(null);
    if (step === 0) {
      if (!serviceType) {
        setErrorMsg("Seleziona la tipologia di intervento richiesta.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!preferredTime) {
        setErrorMsg("Indica la fascia oraria preferita.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!address.trim() || address.trim().length < 5) {
        setErrorMsg("Inserisci l'indirizzo completo (via, civico e città) per l'intervento.");
        return;
      }
      if (!description.trim() || description.trim().length < 5) {
        setErrorMsg("Descrivi brevemente il guasto o il lavoro da effettuare.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!customerName.trim()) {
        setErrorMsg("Inserisci il tuo nome e cognome.");
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, "").length < 6) {
        setErrorMsg("Inserisci un numero di telefono valido per essere ricontattato.");
        return;
      }
      if (!privacyAccepted) {
        setErrorMsg("È necessario accettare l'informativa sulla privacy per procedere.");
        return;
      }
      setStep(4);
    }
  };

  const goBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleFinalSubmit = () => {
    setErrorMsg(null);

    const payload: ServiceRequestInput = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      serviceType,
      description: description.trim(),
      urgency,
      preferredTime,
    };

    startTransition(async () => {
      const res = await createServiceRequest(payload);
      if (res.success) {
        setSuccessData({
          message: res.message,
          ticketId: res.data?.id,
        });
      } else {
        setErrorMsg(res.message || "Errore durante l'invio della richiesta.");
      }
    });
  };

  // Schermata di Successo stile Schedly
  if (successData) {
    return (
      <div className="text-center p-8 bg-white border-2 border-emerald-500/30 rounded-3xl max-w-xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4 shadow-xs">
          🔧
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Richiesta Intervento Inviata!
        </h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Grazie <strong>{customerName}</strong>! La tua richiesta per <strong>{serviceType}</strong> è stata acquisita dai tecnici reperibili.
        </p>

        {successData.ticketId && (
          <div className="mt-4 p-3 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-700">
            Codice Ticket: #{successData.ticketId.slice(0, 8)}
          </div>
        )}

        <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3 text-left">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Priorità {urgency === "EMERGENZA" ? "Massima H24" : urgency === "URGENTE" ? "Urgente entro 24h" : "Ordinaria"}</p>
            <p className="text-emerald-700 mt-0.5">
              Un nostro tecnico ti contatterà al numero <strong>{phone}</strong> per confermare l&apos;orario esatto di arrivo e il materiale necessario.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccessData(null);
            setStep(0);
          }}
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar a pallini stile Schedly */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((label, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                idx < step
                  ? "bg-indigo-600 text-white"
                  : idx === step
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {idx < step ? "✓" : idx + 1}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-5 sm:w-10 h-0.5 ${
                  idx < step ? "bg-indigo-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Step {step + 1} di {STEPS.length}: <span className="text-indigo-600 font-bold">{STEPS[step]}</span>
      </p>

      {/* Card Contenuto Step */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 0: Tipo Guasto */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Di che tipo di assistenza hai bisogno?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Seleziona la specializzazione dell&apos;artigiano richiesto.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((s, idx) => {
                const Icon = s.icon;
                const isSelected = serviceType === s.title;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setServiceType(s.title)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200 shadow-xs"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Urgenza & Orario */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Qual è l&apos;urgenza dell&apos;intervento?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Definisci la priorità per consentire la corretta allocazione della squadra tecnica.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "ORDINARIO",
                  label: "Ordinario",
                  desc: "Intervento programmabile nei prossimi giorni.",
                  badge: "Standard",
                },
                {
                  id: "URGENTE",
                  label: "Urgente",
                  desc: "Risoluzione prioritaria entro 24 ore.",
                  badge: "Priorità",
                },
                {
                  id: "EMERGENZA",
                  label: "Emergenza H24",
                  desc: "Allagamento, guasto bloccante o porta bloccata.",
                  badge: "Subito",
                },
              ].map((lvl) => {
                const isSelected = urgency === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setUrgency(lvl.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? lvl.id === "EMERGENZA"
                          ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                          : "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{lvl.label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          lvl.id === "EMERGENZA"
                            ? "bg-red-100 text-red-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fascia Oraria Preferita
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferredTime(time)}
                    className={`py-3 px-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      preferredTime === time
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Indirizzo e Descrizione Guasto */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dove dobbiamo intervenire?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Indica la posizione dell&apos;immobile e descrivi brevemente il problema.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Indirizzo, Civico, Città *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Es. Via Roma 42, Milano (Piano 3, Int. 8)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrizione del Guasto o Richiesta *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrivi brevemente cosa succede (es. perdita tubo sotto il lavandino, salvavita che non risale...)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Dati Contatto */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chi possiamo contattare?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Un tecnico ti chiamerà per concordare l&apos;uscita e il preventivo.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome e Cognome *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefono Cellulare per Reperibilità *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 340 1234567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email (Opzionale per invio rapportino digitale)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario.rossi@email.it"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded mt-0.5 cursor-pointer"
                />
                <span>
                  Accetto l&apos;informativa sulla privacy (GDPR) e autorizzo il contatto telefonico per l&apos;intervento tecnico richiesto.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Riepilogo & Invio */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Riepilogo della Richiesta</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verifica i dati prima di trasmettere il ticket alla squadra tecnica.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Servizio Richiesto</span>
                <span className="font-bold text-slate-900">{serviceType}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Priorità & Urgenza</span>
                <span className="font-bold text-indigo-600">{urgency}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Fascia Oraria</span>
                <span className="font-bold text-slate-900">{preferredTime}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Indirizzo Intervento</span>
                <span className="font-bold text-slate-900">{address}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Richiedente</span>
                <span className="font-bold text-slate-900">{customerName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Telefono Reperibilità</span>
                <span className="font-bold text-slate-900">{phone}</span>
              </div>
              <div className="pt-2 text-xs text-slate-600">
                <span className="font-bold">Dettaglio Guasto:</span> {description}
              </div>
            </div>
          </div>
        )}

        {/* Pulsanti Navigazione Step */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Indietro
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span>Continua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              {isPending ? "Invio in corso..." : "Invia Richiesta Intervento 🔧"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
