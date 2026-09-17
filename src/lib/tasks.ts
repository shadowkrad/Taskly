import { prisma, ensureDatabaseSchema } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string;
  dueDate: Date | string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
}

export const FALLBACK_TASKS: TaskItem[] = [
  {
    id: 'demo-1',
    title: 'Sanificazione e pulizia locali operativi',
    description: 'Completare la sanificazione giornaliera secondo i protocolli igienico-sanitari e registrare il checklist.',
    status: 'IN_CORSO',
    priority: 'ALTA',
    category: 'Operazioni & Igiene',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Rifornimento magazzino e verifica scorte',
    description: 'Controllo giacenze prodotti critici, emissione ordini di riordino ai fornitori convenzionati.',
    status: 'DA_FARE',
    priority: 'ALTA',
    category: 'Logistica & Magazzino',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Verifica cassa e quadratura corrispettivi serali',
    description: 'Controllo quadratura cassa fiscale, riconciliazione pos bancari e report chiusura per Taaaac Core.',
    status: 'COMPLETATO',
    priority: 'MEDIA',
    category: 'Amministrazione',
    dueDate: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Controllo scadenze e promemoria WhatsApp clienti',
    description: 'Invio notifiche automatiche tramite Taaaac Core per conferme appuntamenti e ordini in consegna.',
    status: 'DA_FARE',
    priority: 'MEDIA',
    category: 'Customer Care',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
];

export async function getTasks(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<TaskItem[]> {
  try {
    await ensureDatabaseSchema();
    const whereClause: Prisma.TaskWhereInput = {};

    if (filters?.status && filters.status !== 'ALL') {
      whereClause.status = filters.status;
    }

    if (filters?.priority && filters.priority !== 'ALL') {
      whereClause.priority = filters.priority;
    }

    if (filters?.search && filters.search.trim()) {
      whereClause.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { category: { contains: filters.search } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    if (!tasks || tasks.length === 0) {
      return filterFallbackTasks(filters);
    }

    return tasks;
  } catch (error) {
    console.warn('[getTasks] Fallback a compiti demo realistici:', error);
    return filterFallbackTasks(filters);
  }
}

function filterFallbackTasks(filters?: { status?: string; priority?: string; search?: string }): TaskItem[] {
  return FALLBACK_TASKS.filter((t) => {
    const matchStatus = !filters?.status || filters.status === 'ALL' || t.status === filters.status;
    const matchPriority = !filters?.priority || filters.priority === 'ALL' || t.priority === filters.priority;
    const matchSearch =
      !filters?.search ||
      !filters.search.trim() ||
      t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(filters.search.toLowerCase())) ||
      t.category.toLowerCase().includes(filters.search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });
}

export async function seedSampleTasksIfEmpty() {
  try {
    await ensureDatabaseSchema();
    const count = await prisma.task.count();
    if (count === 0) {
      await prisma.task.createMany({
        data: [
          {
            title: 'Sanificazione e pulizia locali operativi',
            description: 'Completare la sanificazione giornaliera secondo i protocolli igienico-sanitari e registrare il checklist.',
            status: 'IN_CORSO',
            priority: 'ALTA',
            category: 'Operazioni & Igiene',
            dueDate: new Date(Date.now() + 86400000),
          },
          {
            title: 'Rifornimento magazzino e verifica scorte',
            description: 'Controllo giacenze prodotti critici, emissione ordini di riordino ai fornitori convenzionati.',
            status: 'DA_FARE',
            priority: 'ALTA',
            category: 'Logistica & Magazzino',
            dueDate: new Date(Date.now() + 86400000 * 2),
          },
          {
            title: 'Verifica cassa e quadratura corrispettivi serali',
            description: 'Controllo quadratura cassa fiscale, riconciliazione pos bancari e report chiusura per Taaaac Core.',
            status: 'COMPLETATO',
            priority: 'MEDIA',
            category: 'Amministrazione',
            completedAt: new Date(),
          },
          {
            title: 'Allineamento brand e palette dinamica Taaaac Core',
            description: 'Verificare che le variabili CSS recepite da Taaaac Core applichino correttamente i colori del cliente.',
            status: 'DA_FARE',
            priority: 'BASSA',
            category: 'Design System',
            dueDate: new Date(Date.now() + 86400000 * 7),
          },
        ],
      });
      revalidatePath('/');
    }
  } catch (error) {
    console.warn('[seedSampleTasksIfEmpty] Impossibile accedere o popolare il database:', error);
  }
}
