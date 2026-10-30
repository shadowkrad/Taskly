"use client";

import React, { useState } from "react";
import { Award, Gift, Plus, Trash2, Sparkles, Percent, Wrench, ShieldCheck, Smartphone } from "lucide-react";
import FidelityCashierScanner from "./FidelityCashierScanner";

export interface FidelityRewardItem {
  id: string;
  name: string;
  pointsRequired: number;
  rewardType: "DISCOUNT" | "FREE_ITEM";
  discountAmount?: number;
  freeItemName?: string;
}

export interface FidelitySettingsData {
  enabled: boolean;
  pointsPerEuro: number;
  welcomeBonusPoints: number;
  minPointsToRedeem: number;
  rewards: FidelityRewardItem[];
}

const PRESET_MANUTENZIONI: FidelitySettingsData = {
  enabled: true,
  pointsPerEuro: 1,
  welcomeBonusPoints: 15,
  minPointsToRedeem: 50,
  rewards: [
    { id: "rew_t1", name: "Diritto di Chiamata Urgente H24 Gratuito", pointsRequired: 50, rewardType: "FREE_ITEM", freeItemName: "Azzeramento costo fisso uscita tecnico per urgenze" },
    { id: "rew_t2", name: "Sconto 25€ su Manutenzione o Riparazione", pointsRequired: 120, rewardType: "DISCOUNT", discountAmount: 25 },
    { id: "rew_t3", name: "Check-up & Sanificazione Impianto Omaggio", pointsRequired: 200, rewardType: "FREE_ITEM", freeItemName: "Pulizia filtri e controllo fumi/pressione completo" },
  ],
};

const PRESET_CONDOMINIALE: FidelitySettingsData = {
  enabled: true,
  pointsPerEuro: 1,
  welcomeBonusPoints: 20,
  minPointsToRedeem: 60,
  rewards: [
    { id: "rew_c1", name: "Report Fotografico Stato Impianti Omaggio", pointsRequired: 60, rewardType: "FREE_ITEM", freeItemName: "Perizia tecnica e documentazione fotografica" },
    { id: "rew_c2", name: "Sconto 50€ su Intervento Straordinario", pointsRequired: 180, rewardType: "DISCOUNT", discountAmount: 50 },
    { id: "rew_c3", name: "Estensione Garanzia Ricambi a 24 Mesi", pointsRequired: 250, rewardType: "FREE_ITEM", freeItemName: "Garanzia totale estesa su componenti installati" },
  ],
};

export default function FidelitySettingsPanel({ data, onChange }: { data: FidelitySettingsData; onChange: (upd: FidelitySettingsData) => void }) {
  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardPoints, setNewRewardPoints] = useState(50);
  const [newRewardType, setNewRewardType] = useState<"DISCOUNT" | "FREE_ITEM">("FREE_ITEM");
  const [newRewardValue, setNewRewardValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddReward = () => {
    if (!newRewardName.trim()) return;

    const newItem: FidelityRewardItem = {
      id: "rew_" + Date.now(),
      name: newRewardName.trim(),
      pointsRequired: Math.max(1, Number(newRewardPoints) || 10),
      rewardType: newRewardType,
      discountAmount: newRewardType === "DISCOUNT" ? Number(newRewardValue) || 10 : undefined,
      freeItemName: newRewardType === "FREE_ITEM" ? (newRewardValue.trim() || newRewardName.trim()) : undefined,
    };

    onChange({
      ...data,
      rewards: [...(data.rewards || []), newItem],
    });

    setNewRewardName("");
    setNewRewardPoints(50);
    setNewRewardValue("");
    setShowAddForm(false);
  };

  const handleRemoveReward = (id: string) => {
    onChange({
      ...data,
      rewards: (data.rewards || []).filter((r) => r.id !== id),
    });
  };

  const applyPreset = (preset: FidelitySettingsData) => {
    onChange({
      ...preset,
      enabled: data.enabled !== undefined ? data.enabled : true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Taaaac Fidelity & Fedeltà Clienti</h3>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                  Novità v1.1.0
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Fidelizza i clienti privati e gli amministratori di condominio con punti automatici su manutenzioni e interventi tecnici. Notifiche saldo direttamente su Telegram o WhatsApp.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.enabled || false}
              onChange={(e) => onChange({ ...data, enabled: e.target.checked })}
            />
            <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {data.enabled && (
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              Il programma fedeltà è attivo. Il numero di telefono del cliente o del referente di cantiere è la sua tessera virtuale!
            </span>
          </div>
        )}
      </div>

      {data.enabled && (
        <>
          {/* Preset Taskly */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-semibold text-neutral-900 dark:text-white">Preset Consigliati per Assistenza & Impianti</h4>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              Configura la campagna punti con un solo click scegliendo un modello collaudato per servizi tecnici:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => applyPreset(PRESET_MANUTENZIONI)}
                className="flex items-start gap-3 p-3 text-left rounded-xl bg-white dark:bg-neutral-900 border border-indigo-200/80 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm"
              >
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm text-neutral-900 dark:text-white">Manutenzioni Private & Clima</div>
                  <div className="text-xs text-neutral-500 mt-0.5">1 punto ogni 1 € • Chiamata urgente azzerata a 50 pt • Sconto 25€ a 120 pt</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(PRESET_CONDOMINIALE)}
                className="flex items-start gap-3 p-3 text-left rounded-xl bg-white dark:bg-neutral-900 border border-indigo-200/80 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm text-neutral-900 dark:text-white">Condomini & Grandi Impianti</div>
                  <div className="text-xs text-neutral-500 mt-0.5">1 punto ogni 1 € • Report perizia omaggio a 60 pt • Sconto 50€ a 180 pt</div>
                </div>
              </button>
            </div>
          </div>

          {/* Regole di Assegnazione Punti */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-neutral-500" />
              Regole di Assegnazione & Accumulo Punti
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Punti per ogni Euro speso (€)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={data.pointsPerEuro || 1}
                  onChange={(e) => onChange({ ...data, pointsPerEuro: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Es. 1 = 1 punto ogni 1 € fatturato</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Punti Bonus di Benvenuto
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={data.welcomeBonusPoints || 15}
                  onChange={(e) => onChange({ ...data, welcomeBonusPoints: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Accreditati alla prima presa in carico ticket</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Soglia Minima per Riscatto
                </label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={data.minPointsToRedeem || 50}
                  onChange={(e) => onChange({ ...data, minPointsToRedeem: parseInt(e.target.value, 10) || 50 })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Punti minimi per richiedere sconti/omaggi</p>
              </div>
            </div>
          </div>

          {/* Catalogo Premi */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-indigo-500" />
                  Catalogo Premi & Vantaggi Manutenzione
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Definisci i vantaggi che i clienti possono riscattare con i punti accumulati
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Aggiungi Premio
              </button>
            </div>

            {/* Form Aggiunta Premio */}
            {showAddForm && (
              <div className="p-4 mb-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="font-medium text-xs text-neutral-700 dark:text-neutral-300">Nuovo Premio da Catalogo</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-neutral-500 mb-1">Nome Premio / Servizio</label>
                    <input
                      type="text"
                      placeholder="es. Check-up Impianto Clima o Sconto 25€"
                      value={newRewardName}
                      onChange={(e) => setNewRewardName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Punti Richiesti</label>
                    <input
                      type="number"
                      min="1"
                      value={newRewardPoints}
                      onChange={(e) => setNewRewardPoints(parseInt(e.target.value, 10) || 10)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Tipologia</label>
                    <select
                      value={newRewardType}
                      onChange={(e) => setNewRewardType(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                    >
                      <option value="FREE_ITEM">Intervento / Servizio Omaggio</option>
                      <option value="DISCOUNT">Sconto in Fattura (€)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">
                    {newRewardType === "DISCOUNT" ? "Valore dello Sconto (€)" : "Dettaglio / Descrizione Servizio Omaggio"}
                  </label>
                  <input
                    type="text"
                    placeholder={newRewardType === "DISCOUNT" ? "es. 25 (per 25€ di sconto)" : "es. Pulizia filtri e verifica pressione gas refrigerante"}
                    value={newRewardValue}
                    onChange={(e) => setNewRewardValue(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={handleAddReward}
                    className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Salva Premio
                  </button>
                </div>
              </div>
            )}

            {/* Elenco Premi */}
            {(!data.rewards || data.rewards.length === 0) ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                Nessun premio configurato. Clicca &quot;Aggiungi Premio&quot; o applica un preset sopra.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {data.rewards.map((reward) => (
                  <div key={reward.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          {reward.name}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {reward.rewardType === "DISCOUNT" ? `Sconto €${reward.discountAmount}` : "Omaggio"}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          {reward.rewardType === "FREE_ITEM" && reward.freeItemName ? reward.freeItemName : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
                        {reward.pointsRequired} pt
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReward(reward.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Elimina premio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scanner & Cassa Fidelity Rapido */}
          <FidelityCashierScanner
            tenantName="Service & Manutenzioni"
            pointsPerEuro={data.pointsPerEuro || 1}
            welcomeBonusPoints={data.welcomeBonusPoints || 20}
            rewards={data.rewards || []}
          />
        </>
      )}
    </div>
  );
}
