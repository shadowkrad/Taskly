"use client";

import React, { useCallback, useEffect, useState } from "react";
import { UserCheck, Phone, MapPin, Plus, X, Search, Award, Cake } from "lucide-react";
import { classificaTelefono, ETICHETTA_TELEFONO } from "@/lib/phone";

interface Cliente {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  birthDate: string | null;
  marketingConsent: boolean;
  loyaltyPoints: number;
  tokenTessera?: string;
}
interface Dettaglio {
  cliente: Cliente;
  buoni: { id: string; codice: string; tipoValore: string; saldoResiduo: number; percentuale: number | null; descrizioneServizio: string | null; dataScadenza: string | null }[];
  interventi: { id: string; serviceType: string; status: string; finalCost: number | null; estimatedCost: number | null; createdAt: string }[];
}

const vuoto = { name: "", phone: "", email: "", address: "", notes: "", birthDate: "", marketingConsent: false };
const campo = "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none";
const etichetta = "block text-xs font-semibold text-slate-700 mb-1";

export default function ClientiPage() {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [ricerca, setRicerca] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [aperto, setAperto] = useState<Dettaglio | null>(null);
  const [form, setForm] = useState<typeof vuoto & { id?: string }>(vuoto);
  const [modale, setModale] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [duplicatoId, setDuplicatoId] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  const carica = useCallback(async () => {
    setCaricamento(true);
    try {
      const r = await fetch(`/api/clienti?q=${encodeURIComponent(ricerca.trim())}`);
      const d = await r.json();
      setClienti(d.clienti || []);
    } finally {
      setCaricamento(false);
    }
  }, [ricerca]);

  useEffect(() => {
    const t = setTimeout(carica, 250);
    return () => clearTimeout(t);
  }, [carica]);

  const apriScheda = async (id: string) => {
    const r = await fetch(`/api/clienti/${id}`);
    if (r.ok) setAperto(await r.json());
  };

  const nuovo = () => {
    setForm(vuoto);
    setErrore(null);
    setDuplicatoId(null);
    setModale(true);
  };
  const modifica = (c: Cliente) => {
    setForm({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || "",
      address: c.address || "",
      notes: c.notes || "",
      birthDate: c.birthDate ? c.birthDate.slice(0, 10) : "",
      marketingConsent: c.marketingConsent,
    });
    setErrore(null);
    setDuplicatoId(null);
    setModale(true);
  };

  const salva = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvo(true);
    setErrore(null);
    setDuplicatoId(null);
    try {
      const { id, ...dati } = form;
      const r = await fetch(id ? `/api/clienti/${id}` : "/api/clienti", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dati),
      });
      const d = await r.json();
      if (!r.ok) {
        setErrore(d.error || "Salvataggio non riuscito");
        setDuplicatoId(d.clienteEsistenteId || null);
        return;
      }
      setModale(false);
      carica();
      if (id && aperto?.cliente.id === id) apriScheda(id);
    } finally {
      setSalvo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Clienti
          </h1>
          <p className="text-sm text-slate-500 mt-1">Un numero di telefono, un cliente: storico interventi, punti fedeltà e buoni.</p>
        </div>
        <button onClick={nuovo} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Nuovo cliente
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={ricerca} onChange={(e) => setRicerca(e.target.value)} placeholder="Cerca per nome, telefono o email…" className={`${campo} pl-9`} />
      </div>

      {caricamento ? (
        <p className="text-sm text-slate-400 py-8 text-center">Caricamento clienti…</p>
      ) : clienti.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">Nessun cliente trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clienti.map((c) => (
            <button
              key={c.id}
              onClick={() => apriScheda(c.id)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                  <Award className="w-3 h-3" /> {c.loyaltyPoints}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                  {classificaTelefono(c.phone) === "FISSO" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">{ETICHETTA_TELEFONO.FISSO}</span>
                  )}
                </div>
                {c.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.address}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Scheda cliente */}
      {aperto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto px-6 pb-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{aperto.cliente.name}</h3>
                <p className="text-xs text-slate-500">
                  {aperto.cliente.phone} · {ETICHETTA_TELEFONO[classificaTelefono(aperto.cliente.phone)]}
                  {aperto.cliente.birthDate && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      <Cake className="w-3 h-3" />
                      {new Date(aperto.cliente.birthDate).toLocaleDateString("it-IT", { day: "numeric", month: "long", timeZone: "UTC" })}
                    </span>
                  )}
                </p>
              </div>
              <button onClick={() => setAperto(null)} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 p-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 leading-none">{aperto.cliente.loyaltyPoints}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase">punti fedeltà</div>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <a href="/dashboard/fedelta" className="font-semibold text-indigo-700 underline">Gestisci in cassa fedeltà</a>
                {aperto.cliente.tokenTessera && (
                  <a href={`/tessera/${aperto.cliente.tokenTessera}`} target="_blank" rel="noreferrer" className="font-semibold text-indigo-700 underline">Apri la tessera digitale</a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Buoni attivi</h4>
              {aperto.buoni.length === 0 ? (
                <p className="text-xs text-slate-400">Nessun buono attivo.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {aperto.buoni.map((b) => (
                    <li key={b.id} className="py-1.5">
                      <span className="font-medium text-slate-800">
                        {b.tipoValore === "PERCENTUALE" ? `${b.percentuale}% di sconto` : b.tipoValore === "SERVIZIO" ? b.descrizioneServizio : `${b.saldoResiduo.toFixed(2)} € di credito`}
                      </span>
                      <span className="block text-[11px] text-slate-400 font-mono">
                        {b.codice} · {b.dataScadenza ? `scade il ${new Date(b.dataScadenza).toLocaleDateString("it-IT")}` : "senza scadenza"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Interventi</h4>
              {aperto.interventi.length === 0 ? (
                <p className="text-xs text-slate-400">Nessun intervento registrato.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {aperto.interventi.map((i) => (
                    <li key={i.id} className="py-1.5 flex items-center justify-between gap-3">
                      <span className="text-slate-800">{i.serviceType}</span>
                      <span className="text-xs text-slate-500">
                        {i.status.replace("_", " ")} · {new Date(i.createdAt).toLocaleDateString("it-IT")}
                        {(i.finalCost ?? i.estimatedCost) ? ` · ${(i.finalCost ?? i.estimatedCost)!.toFixed(2)} €` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sticky bottom-0 bg-white py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  modifica(aperto.cliente);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
              >
                Modifica dati
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nuovo / modifica */}
      {modale && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={salva} className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto px-6 pb-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-900 text-lg">{form.id ? "Modifica cliente" : "Nuovo cliente"}</h3>
              <button type="button" onClick={() => setModale(false)} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={etichetta}>Nome e cognome *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={campo} />
              </div>
              <div>
                <label className={etichetta}>Telefono *</label>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={campo} />
                {classificaTelefono(form.phone) === "FISSO" && <p className="text-[11px] text-amber-700 mt-1">Telefono fisso: non riceve WhatsApp o messaggi.</p>}
              </div>
              <div>
                <label className={etichetta}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={campo} />
              </div>
              <div>
                <label className={etichetta}>Data di nascita (per il buono compleanno)</label>
                <input type="date" max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={campo} />
              </div>
            </div>
            <div>
              <label className={etichetta}>Indirizzo</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={campo} />
            </div>
            <div>
              <label className={etichetta}>Note</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={campo} />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={form.marketingConsent} onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })} />
              Consenso a comunicazioni promozionali (es. buono compleanno per email)
            </label>
            {errore && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errore}{" "}
                {duplicatoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setModale(false);
                      apriScheda(duplicatoId);
                    }}
                    className="underline"
                  >
                    Apri la scheda esistente →
                  </button>
                )}
              </div>
            )}
            <div className="sticky bottom-0 bg-white py-3 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setModale(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold">
                Annulla
              </button>
              <button type="submit" disabled={salvo} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold">
                {salvo ? "Salvo…" : "Salva"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
