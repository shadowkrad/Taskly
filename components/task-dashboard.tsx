'use client';

import React, { useState, useTransition } from 'react';
import { TaskItem, createTask, updateTaskStatus, deleteTask } from '@/app/actions/tasks';
import { useTenant } from './tenant-provider';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Trash2, 
  AlertCircle, 
  Calendar, 
  Tag, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

interface TaskDashboardProps {
  initialTasks: TaskItem[];
}

export function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const { config, hasAddon } = useTenant();
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  // Filtri
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Stato modale nuovo task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIA');
  const [newCategory, setNewCategory] = useState('Generale');
  const [newDueDate, setNewDueDate] = useState('');

  // Azione rapida creazione task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formData = new FormData();
    formData.append('title', newTitle.trim());
    formData.append('description', newDescription.trim());
    formData.append('priority', newPriority);
    formData.append('category', newCategory.trim() || 'Generale');
    if (newDueDate) formData.append('dueDate', newDueDate);

    // Optimistic item
    const tempId = 'temp-' + Date.now();
    const optimisticTask: TaskItem = {
      id: tempId,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      status: 'DA_FARE',
      priority: newPriority,
      category: newCategory.trim() || 'Generale',
      dueDate: newDueDate ? new Date(newDueDate) : null,
      completedAt: null,
      createdAt: new Date(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');

    startTransition(async () => {
      const res = await createTask(formData);
      if (res?.error) {
        // Rollback
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        alert(res.error);
      }
    });
  };

  // Cambio di stato task
  const handleStatusChange = (task: TaskItem, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'COMPLETATO' ? new Date() : null,
            }
          : t
      )
    );

    startTransition(async () => {
      await updateTaskStatus(task.id, newStatus);
    });
  };

  // Eliminazione task
  const handleDeleteTask = (id: string) => {
    if (!confirm('Vuoi eliminare questa attività?')) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    startTransition(async () => {
      const res = await deleteTask(id);
      if (res?.error) {
        setTasks(previousTasks);
        alert(res.error);
      }
    });
  };

  // Filtraggio
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Metriche
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'DA_FARE').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_CORSO').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETATO').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIA':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BASSA':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Schede Metriche / KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-taaaac flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Totale Attività</span>
            <CircleDashed className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-400">task registrati</span>
          </div>
        </div>

        <div className="card-taaaac flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-500 text-xs font-semibold uppercase">
            <span>Da Fare</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{todoCount}</span>
            <span className="text-xs text-indigo-600 font-medium">in attesa</span>
          </div>
        </div>

        <div className="card-taaaac flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-500 text-xs font-semibold uppercase">
            <span>In Corso</span>
            <CircleDashed className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{inProgressCount}</span>
            <span className="text-xs text-amber-600 font-medium">operativi</span>
          </div>
        </div>

        <div className="card-taaaac flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-500 text-xs font-semibold uppercase">
            <span>Completati</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{completedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">({completionRate}%)</span>
          </div>
        </div>
      </div>

      {/* Barra di Controllo: Cerca, Filtri e Nuovo Task */}
      <div className="card-taaaac flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Cerca */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per titolo o categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filtro Stato */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200/90 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="ALL">Tutti gli Stati</option>
            <option value="DA_FARE">Da Fare</option>
            <option value="IN_CORSO">In Corso</option>
            <option value="COMPLETATO">Completati</option>
          </select>

          {/* Filtro Priorità */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200/90 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="ALL">Tutte le Priorità</option>
            <option value="ALTA">Priorità Alta</option>
            <option value="MEDIA">Priorità Media</option>
            <option value="BASSA">Priorità Bassa</option>
          </select>
        </div>

        {/* Bottone Crea Attività */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-taaaac flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm shadow-xs w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Attività</span>
        </button>
      </div>

      {/* Lista Task */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="card-taaaac py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Nessun task trovato</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Non ci sono attività corrispondenti ai filtri correnti o non hai ancora registrato nuovi compiti.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'card-taaaac flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-slate-300',
                task.status === 'COMPLETATO' && 'opacity-70 bg-slate-50/50'
              )}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Status Toggle Button */}
                <button
                  onClick={() => {
                    const next =
                      task.status === 'DA_FARE'
                        ? 'IN_CORSO'
                        : task.status === 'IN_CORSO'
                        ? 'COMPLETATO'
                        : 'DA_FARE';
                    handleStatusChange(task, next);
                  }}
                  title="Cambia stato"
                  className={cn(
                    'mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer',
                    task.status === 'COMPLETATO'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : task.status === 'IN_CORSO'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-slate-300 text-transparent hover:border-indigo-400'
                  )}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={cn(
                        'text-sm font-bold text-slate-900 tracking-tight',
                        task.status === 'COMPLETATO' && 'line-through text-slate-400'
                      )}
                    >
                      {task.title}
                    </h4>

                    {/* Badge Priorità */}
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider',
                        priorityColor(task.priority)
                      )}
                    >
                      {task.priority}
                    </span>

                    {/* Badge Modulo WhatsApp */}
                    {hasAddon('WHATSAPP_REMINDERS') && task.dueDate && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                        <MessageSquare className="w-2.5 h-2.5" /> WA Reminder
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Metadati (Categoria e Data di scadenza) */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                      <Tag className="w-3 h-3 text-slate-400" /> {task.category}
                    </span>

                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Azioni Laterali */}
              <div className="flex items-center gap-2 sm:self-center self-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                {/* Selettore rapido stato */}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value="DA_FARE">Da fare</option>
                  <option value="IN_CORSO">In corso</option>
                  <option value="COMPLETATO">Completato</option>
                </select>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  title="Elimina attività"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Creazione Nuovo Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="card-taaaac max-w-lg w-full bg-white space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Crea Nuova Attività</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Titolo Attività *</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Verifica configurazione Traefik VPS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrizione (Opzionale)</label>
                <textarea
                  rows={2}
                  placeholder="Aggiungi dettagli o note per questo compito..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Priorità</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200/90 rounded-xl text-slate-700"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BASSA">Bassa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoria</label>
                  <input
                    type="text"
                    placeholder="Es. Sviluppo, Amministrazione"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl"
                  >
                  </input>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Data di Scadenza</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl text-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-taaaac px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="btn-taaaac px-5 py-2 text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-xs"
                >
                  Salva Attività
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
