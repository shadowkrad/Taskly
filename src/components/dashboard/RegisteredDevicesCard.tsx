"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  ShieldCheck,
  Plus,
  Trash2,
  PowerOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import { startRegistration } from "@simplewebauthn/browser";

interface DeviceItem {
  id: string;
  deviceName: string;
  deviceType: string;
  status: string;
  registeredAt: string;
  lastUsedAt?: string | null;
}

export default function RegisteredDevicesCard() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings/devices");
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    } catch {
      console.warn("Impossibile caricare i dispositivi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRegisterCurrentDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    setRegistering(true);
    setFeedback(null);

    try {
      // 1. Richiedi opzioni di registrazione al server
      const optRes = await fetch("/api/auth/device/register-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: "Tecnico Taskly" }),
      });

      if (!optRes.ok) {
        const err = await optRes.json();
        throw new Error(err.error || "Impossibile avviare la registrazione");
      }

      const options = await optRes.json();

      // 2. Chiamata biometrica WebAuthn nel browser
      const attResp = await startRegistration({ optionsJSON: options });

      // 3. Invio risposta al server per verifica e salvataggio
      const verifyRes = await fetch("/api/auth/device/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: attResp,
          expectedChallenge: options.challenge,
          deviceName: newDeviceName.trim(),
          deviceType: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "smartphone" : "desktop",
        }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || "Registrazione fallita");
      }

      setFeedback({
        type: "success",
        text: `Dispositivo "${newDeviceName}" associato con successo! Ora puoi accedere con FaceID/PIN.`,
      });
      setNewDeviceName("");
      setShowAddModal(false);
      fetchDevices();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.message || "Errore durante l'associazione del sensore biometrico.",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleRevokeDevice = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler SCOLLEGARE da remoto il dispositivo "${name}"? Non potra piu accedere senza ri-autenticarsi.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/settings/devices?id=${id}&action=revoke`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedback({ type: "success", text: `Dispositivo "${name}" scollegato con successo.` });
        fetchDevices();
      } else {
        const data = await res.json();
        setFeedback({ type: "error", text: data.error || "Errore durante la disconnessione." });
      }
    } catch {
      setFeedback({ type: "error", text: "Errore di rete." });
    }
  };

  const handleDeleteDevice = async (id: string, name: string) => {
    if (!confirm(`Vuoi eliminare definitivamente "${name}" dalla lista dei dispositivi autorizzati?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/settings/devices?id=${id}&action=delete`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedback({ type: "success", text: `Dispositivo "${name}" eliminato definitivamente.` });
        fetchDevices();
      } else {
        const data = await res.json();
        setFeedback({ type: "error", text: data.error || "Errore durante l'eliminazione." });
      }
    } catch {
      setFeedback({ type: "error", text: "Errore di rete." });
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/80 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Dispositivi PWA & Accesso Biometrico
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                v1.0.2
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accedi istantaneamente da smartphone o palmare tecnico con FaceID, impronta o PIN del dispositivo senza digitare la password.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDevices}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Aggiorna lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Collega Dispositivo</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Lista Dispositivi */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Caricamento dispositivi autorizzati...</div>
      ) : devices.length === 0 ? (
        <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Fingerprint className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Nessun dispositivo PWA registrato</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            Registra lo smartphone o il tablet con cui esegui gli interventi per accedere al volo con sensore biometrico o PIN.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {devices.map((device) => {
            const isRevoked = device.status === "REVOKED";
            return (
              <div key={device.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isRevoked
                        ? "bg-rose-50 text-rose-500 border border-rose-200"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{device.deviceName}</span>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                          isRevoked
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isRevoked ? "Scollegato" : "Attivo"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Registrato il {new Date(device.registeredAt).toLocaleDateString("it-IT")}
                      {device.lastUsedAt && ` • Ultimo accesso ${new Date(device.lastUsedAt).toLocaleDateString("it-IT")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!isRevoked ? (
                    <button
                      type="button"
                      onClick={() => handleRevokeDevice(device.id, device.deviceName)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      title="Scollega da remoto"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>Scollega</span>
                    </button>
                  ) : (
                    <span className="text-xs text-rose-600 font-semibold italic">Revocato</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteDevice(device.id, device.deviceName)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Elimina definitivamente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Box Info Sicurezza */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Massima Sicurezza Crittografica FIDO2:</strong> I dati biometrici (impronte, volti) non lasciano mai il tuo smartphone e non vengono salvati sui nostri server. Se un dispositivo viene smarrito o un collaboratore lascia il team, puoi revocarlo all&apos;istante da questo pannello.
        </p>
      </div>

      {/* Modal Aggiungi Dispositivo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                Collega Questo Dispositivo
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Assegna un nome per riconoscere questo smartphone o tablet in futuro.
              </p>
            </div>

            <form onSubmit={handleRegisterCurrentDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Dispositivo</label>
                <input
                  type="text"
                  required
                  placeholder="Es. iPhone Personale o Tablet Officina"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={registering}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={registering || !newDeviceName.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {registering ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Conferma sul sensore...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Attiva Biometria</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
