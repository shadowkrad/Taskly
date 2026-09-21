'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  FileCheck,
  Trash2,
  Edit,
  Search,
  ExternalLink,
  Euro,
} from 'lucide-react';
import type { ServiceRequestItem } from '@/lib/interventions';
import { WorkReportModal } from './WorkReportModal';
import { StatusModal } from './StatusModal';
import { deleteServiceRequest } from '@/app/actions/interventions';

interface AdminDashboardProps {
  initialInterventions: ServiceRequestItem[];
}

export function AdminDashboard({ initialInterventions }: AdminDashboardProps) {
  const router = useRouter();
  const [interventions, setInterventions] = useState<ServiceRequestItem[]>(initialInterventions);
  const [selectedForReport, setSelectedForReport] = useState<ServiceRequestItem | null>(null);
  const [selectedForStatus, setSelectedForStatus] = useState<ServiceRequestItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metriche
  const pendingCount = interventions.filter((i) => i.status === 'IN_ATTESA').length;
  const scheduledCount = interventions.filter((i) => i.status === 'PIANIFICATO').length;
  const inProgressCount = interventions.filter((i) => i.status === 'IN_CORSO').length;
  const completedList = interventions.filter((i) => i.status === 'COMPLETATO');
  const completedCount = completedList.length;

  const totalRevenue = completedList.reduce((acc, curr) => {
    if (curr.finalCost) return acc + curr.finalCost;
    if (curr.workReports && curr.workReports.length > 0) {
      return acc + curr.workReports[0].totalAmount;
    }
    return acc;
  }, 0);

  // Filtro dati
  const filteredInterventions = interventions.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (urgencyFilter !== 'ALL' && item.urgency !== urgencyFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.customerName.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      const matchAddress = item.address.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchType = item.serviceType.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchAddress && !matchDesc && !matchType) return false;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo intervento?')) return;
    setInterventions((prev) => prev.filter((i) => i.id !== id));
    await deleteServiceRequest(id);
    router.refresh();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* 1. Statistiche & KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-taaaac bg-white border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">In Attesa</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
            <span className="text-xs text-amber-600 font-bold">Da pianificare</span>
          </div>
        </div>

        <div className="card-taaaac bg-white border-indigo-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Pianificati</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{scheduledCount}</span>
            <span className="text-xs text-indigo-600 font-bold">In agenda</span>
          </div>
        </div>

        <div className="card-taaaac bg-white border-sky-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">In Corso</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{inProgressCount}</span>
            <span className="text-xs text-sky-600 font-bold">Sul posto</span>
          </div>
        </div>

        <div className="card-taaaac bg-white border-emerald-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Incasso Rapportini</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Euro className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">€{totalRevenue.toFixed(0)}</span>
            <span className="text-xs text-slate-600 font-semibold">({completedCount} chiusi)</span>
          </div>
        </div>
      </div>

      {/* 2. Barra Filtri e Ricerca */}
      <div className="card-taaaac bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Stato */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { label: 'Tutti', value: 'ALL' },
              { label: 'In Attesa', value: 'IN_ATTESA' },
              { label: 'Pianificati', value: 'PIANIFICATO' },
              { label: 'In Corso', value: 'IN_CORSO' },
              { label: 'Completati', value: 'COMPLETATO' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtro Urgenza */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
          >
            <option value="ALL">Tutte le Urgenze</option>
            <option value="EMERGENZA">🔴 Solo Emergenze</option>
            <option value="URGENTE">🟡 Solo Urgenti</option>
            <option value="ORDINARIO">🟢 Solo Ordinari</option>
          </select>
        </div>

        {/* Ricerca Rapida */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca cliente, via, tel..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 3. Griglia Schede Intervento */}
      <div className="space-y-4">
        {filteredInterventions.length === 0 ? (
          <div className="card-taaaac bg-white p-12 text-center text-slate-500">
            <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-sm">Nessun intervento trovato con questi filtri.</p>
            <p className="text-xs mt-1 text-slate-400">Prova a modificare i parametri di ricerca o lo stato selezionato.</p>
          </div>
        ) : (
          filteredInterventions.map((item) => {
            const hasReport = item.workReports && item.workReports.length > 0;
            const report = hasReport ? item.workReports![0] : null;

            return (
              <div
                key={item.id}
                className="card-taaaac bg-white hover:border-slate-300 transition-all p-5 shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info Principali */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Urgenza */}
                      {item.urgency === 'EMERGENZA' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-700" />
                          EMERGENZA 24H
                        </span>
                      )}
                      {item.urgency === 'URGENTE' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                          URGENTE 24H
                        </span>
                      )}
                      {item.urgency === 'ORDINARIO' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          ORDINARIO
                        </span>
                      )}

                      {/* Categoria */}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {item.serviceType}
                      </span>

                      {/* Stato */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === 'COMPLETATO'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.status === 'IN_CORSO'
                            ? 'bg-sky-100 text-sky-900 border-sky-300'
                            : item.status === 'PIANIFICATO'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>

                      {/* Ticket Code */}
                      <span className="text-[10px] font-bold font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-300">
                        #{item.id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Cliente e Problema */}
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {item.customerName}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Recapiti e Data */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/60 px-2 py-1 rounded-lg"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {item.phone}
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-slate-800"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.address}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      {item.scheduledAt && (
                        <div className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>
                            Appunt.: {new Date(item.scheduledAt).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      )}

                      {item.preferredTime && !item.scheduledAt && (
                        <div className="inline-flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Fascia: {item.preferredTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Azioni Tecnico */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Badge Rapportino se presente */}
                    {report ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Rapportino €{report.totalAmount.toFixed(2)} ({report.paymentStatus})
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedForStatus(item)}
                        className="btn-taaaac px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
                        title="Cambia stato o fissa data"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Stato</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedForReport(item)}
                        className={`btn-taaaac px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-2xs ${
                          hasReport
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{hasReport ? 'Vedi Rapportino' : 'Compila Rapportino'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Elimina richiesta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Compilazione / Visualizzazione Rapportino */}
      {selectedForReport && (
        <WorkReportModal
          intervention={selectedForReport}
          onClose={() => setSelectedForReport(null)}
          onSuccess={() => {
            setSelectedForReport(null);
            handleRefresh();
          }}
        />
      )}

      {/* Modal Cambio Stato / Data Appuntamento */}
      {selectedForStatus && (
        <StatusModal
          intervention={selectedForStatus}
          onClose={() => setSelectedForStatus(null)}
          onSuccess={() => {
            setSelectedForStatus(null);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}
