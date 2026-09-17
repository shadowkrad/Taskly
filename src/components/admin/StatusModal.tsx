'use client';

import React, { useState, useTransition } from 'react';
import { X, Calendar, Edit3, Loader2, CheckCircle2 } from 'lucide-react';
import { updateServiceRequestStatus } from '@/app/actions/interventions';
import type { ServiceRequestItem } from '@/lib/interventions';

interface StatusModalProps {
  intervention: ServiceRequestItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function StatusModal({ intervention, onClose, onSuccess }: StatusModalProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>(intervention.status);
  const [scheduledAt, setScheduledAt] = useState<string>(
    intervention.scheduledAt
      ? new Date(intervention.scheduledAt).toISOString().slice(0, 16)
      : ''
  );
  const [estimatedCost, setEstimatedCost] = useState<number>(intervention.estimatedCost || 0);
  const [notes, setNotes] = useState<string>(intervention.notes || '');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateServiceRequestStatus({
        id: intervention.id,
        status: status as 'IN_ATTESA' | 'PIANIFICATO' | 'IN_CORSO' | 'COMPLETATO' | 'ANNULLATO',
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        estimatedCost: estimatedCost > 0 ? estimatedCost : null,
        notes: notes || null,
      });

      if (res.success) {
        setMessage('Intervento aggiornato!');
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setMessage(res.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm">Aggiorna Stato & Appuntamento</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {message && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Stato Intervento
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
            >
              <option value="IN_ATTESA">In Attesa di Pianificazione</option>
              <option value="PIANIFICATO">Pianificato (Appuntamento fissato)</option>
              <option value="IN_CORSO">In Corso (Tecnico sul posto)</option>
              <option value="COMPLETATO">Completato</option>
              <option value="ANNULLATO">Annullato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Data & Ora Appuntamento
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Preventivo Stimato (€)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Note Tecniche Interne
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Es. Codice citofono, accordi telefonici..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-taaaac px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-taaaac px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
