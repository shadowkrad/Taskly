import React from 'react';
import { getTasks, seedSampleTasksIfEmpty, TaskItem } from '@/lib/tasks';
import { TaskDashboard } from '@/components/task-dashboard';
import { TenantSidebar } from '@/components/tenant-sidebar';
import { CheckSquare2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  let tasks: TaskItem[] = [];
  try {
    await seedSampleTasksIfEmpty();
    tasks = await getTasks();
  } catch (error) {
    console.warn('[TasksPage] Errore inizializzazione dati, fallback a getTasks:', error);
    try {
      tasks = await getTasks();
    } catch {
      tasks = [];
    }
  }

  const safeTasks = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
    completedAt: t.completedAt ? new Date(t.completedAt).toISOString() : null,
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
  })) as unknown as TaskItem[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Intestazione Principale */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Torna alla Vetrina
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <CheckSquare2 className="w-7 h-7 text-indigo-600 shrink-0" />
            Pannello Attività Taskly
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestione operativa attività generiche e compiti tenant.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200/90 rounded-2xl px-4 py-2 shadow-2xs text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Storage isolato per tenant SQLite</span>
        </div>
      </div>

      {/* Griglia a 2 colonne: Dashboard Principale (70%) + Sidebar Tenant (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8">
          <TaskDashboard initialTasks={safeTasks} />
        </section>

        <aside className="lg:col-span-4">
          <TenantSidebar />
        </aside>
      </div>
    </div>
  );
}
