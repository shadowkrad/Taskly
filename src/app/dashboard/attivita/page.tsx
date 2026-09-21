import React from "react";
import { getTasks, seedSampleTasksIfEmpty, TaskItem } from "@/lib/tasks";
import { TaskDashboard } from "@/components/task-dashboard";
import { CheckSquare2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AttivitaPage() {
  let tasks: TaskItem[] = [];
  try {
    await seedSampleTasksIfEmpty();
    tasks = await getTasks();
  } catch (error) {
    console.warn("[AttivitaPage] Errore inizializzazione dati:", error);
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
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <CheckSquare2 className="w-6 h-6 text-indigo-600" />
          Attività Interne & To-Do
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gestione delle attività operative, scadenze manutenzioni periodiche e compiti di squadra.
        </p>
      </div>

      <TaskDashboard initialTasks={safeTasks} />
    </div>
  );
}
