"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { UserCheck, Phone, MapPin, Plus, X, Search, Award } from "lucide-react";
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

const vuoto = { name: "", phone: "", email: "", address: "", notes: "", birthDate: "", marketingConsent: false };
const campo = "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none";
const etichetta = "block text-xs font-semibold text-slate-700 mb-1";

export default function ClientiPage() {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [ricerca, setRicerca] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [form, setForm] = useState<typeof vuoto>(vuoto);
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

  const nuovo = () => {
    setForm(vuoto);
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
      const r = await fetch("/api/clienti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) {
        setErrore(d.error || "Salvataggio non riuscito");
        setDuplicatoId(d.clienteEsistenteId || null);
        return;
      }
      setModale(false);
      carica();
    } finally {
      setSalvo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Anagrafica Clienti (CRM)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Storico interventi, tessera punti fedeltà nel profilo, buoni e invio manuale WhatsApp/Email.
          </p>
        </div>
        <button
          onClick={nuovo}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuovo Cliente
        </button>
      </div>

      {/* Cerca */}
      <div className="relative bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            placeholder="Cerca cliente per nome, telefono o email…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Lista Clienti: Mobile Card View + Desktop Table View stile Schedly */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {caricamento ? (
          <div className="text-center py-12 text-slate-400 text-sm">Caricamento clienti...</div>
        ) : clienti.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">Nessun cliente registrato.</div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100">
              {clienti.map((c) => (
                <div key={c.id} className="p-4 space-y-3 hover:bg-indigo-50/20 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base truncate">{c.name}</h3>
                      <div className="text-xs text-indigo-700 font-bold mt-0.5 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        <span>{c.phone}</span>
                        {classificaTelefono(c.phone) === "FISSO" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            {ETICHETTA_TELEFONO.FISSO}
                          </span>
                        )}
                      </div>
                      {c.email && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">✉️ {c.email}</div>
                      )}
                      {c.address && (
                        <div className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </div>
                      )}
                    </div>

                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Award className="w-3 h-3" />
                      {c.loyaltyPoints} pt
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                    <div>
                      {c.marketingConsent ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          ✓ Promo OK
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                          Solo servizio
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      >
                        Chiama
                      </a>
                      <Link
                        href={`/dashboard/clienti/${c.id}`}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        Scheda →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Cliente</th>
                    <th className="px-4 py-4 font-semibold">Contatti</th>
                    <th className="px-4 py-4 font-semibold">Indirizzo</th>
                    <th className="px-4 py-4 font-semibold">Punti Fedeltà</th>
                    <th className="px-4 py-4 font-semibold text-right">Dettagli</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clienti.map((c) => (
                    <tr key={c.id} className="hover:bg-indigo-50/20">
                      <td className="px-4 py-5 align-middle font-semibold text-slate-900">{c.name}</td>
                      <td className="px-4 py-5 align-middle">
                        <div className="text-xs text-indigo-700 font-bold flex items-center gap-1.5">
                          <span>{c.phone}</span>
                          {classificaTelefono(c.phone) === "FISSO" && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                              {ETICHETTA_TELEFONO.FISSO}
                            </span>
                          )}
                        </div>
                        {c.email ? (
                          <div className="text-xs text-slate-500 mt-0.5">{c.email}</div>
                        ) : (
                          <div className="text-xs text-slate-400 italic mt-0.5">Nessuna email</div>
                        )}
                      </td>
                      <td className="px-4 py-5 align-middle text-xs text-slate-500 max-w-xs truncate">
                        {c.address || "—"}
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Award className="w-3 h-3" />
                          {c.loyaltyPoints} pt
                        </span>
                      </td>
                      <td className="px-4 py-5 align-middle text-right">
                        <Link
                          href={`/dashboard/clienti/${c.id}`}
                          className="text-indigo-600 font-semibold hover:underline text-xs"
                        >
                          Scheda →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Nuovo cliente */}
      {modale && (
        <div className="fixed inset-0 z-[60] !mt-0 bg-slate-900/50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={salva} className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto px-6 pb-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-900 text-lg">Nuovo cliente</h3>
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
                  <Link
                    href={`/dashboard/clienti/${duplicatoId}`}
                    onClick={() => setModale(false)}
                    className="underline"
                  >
                    Apri la scheda esistente →
                  </Link>
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
