'use server';

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
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

const FALLBACK_TASKS: TaskItem[] = [
  {
    id: 'demo-1',
    title: 'Sanificazione e pulizia locali operativi',
    description: 'Completare la sanificazione giornaliera secondo i protocolli igienico-sanitari e registrare il checklist.',
    status: 'IN_CORSO',
    priority: 'ALTA',
    category: 'Operazioni & Igiene',
    dueDate: new Date(Date.now() + 86400000),
    completedAt: null,
    createdAt: new Date(),
  },
  {
    id: 'demo-2',
    title: 'Rifornimento magazzino e verifica scorte',
    description: 'Controllo giacenze prodotti critici, emissione ordini di riordino ai fornitori convenzionati.',
    status: 'DA_FARE',
    priority: 'ALTA',
    category: 'Logistica & Magazzino',
    dueDate: new Date(Date.now() + 86400000 * 2),
    completedAt: null,
    createdAt: new Date(),
  },
  {
    id: 'demo-3',
    title: 'Verifica cassa e quadratura corrispettivi serali',
    description: 'Controllo quadratura cassa fiscale, riconciliazione pos bancari e report chiusura per Taaaac Core.',
    status: 'COMPLETATO',
    priority: 'MEDIA',
    category: 'Amministrazione',
    dueDate: new Date(),
    completedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'demo-4',
    title: 'Controllo scadenze e promemoria WhatsApp clienti',
    description: 'Invio notifiche automatiche tramite Taaaac Core per conferme appuntamenti e ordini in consegna.',
    status: 'DA_FARE',
    priority: 'MEDIA',
    category: 'Customer Care',
    dueDate: new Date(Date.now() + 86400000 * 3),
    completedAt: null,
    createdAt: new Date(),
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

    return tasks;
  } catch (error) {
    console.warn('[getTasks] Fallback a compiti demo realistici:', error);
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
}

export async function createTask(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const priority = (formData.get('priority') as string) || 'MEDIA';
  const category = (formData.get('category') as string)?.trim() || 'Generale';
  const dueDateStr = formData.get('dueDate') as string;

  if (!title) {
    return { error: 'Il titolo è obbligatorio' };
  }

  try {
    await ensureDatabaseSchema();
    await prisma.task.create({
      data: {
        title,
        description,
        priority,
        category,
        status: 'DA_FARE',
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating task:', error);
    return { error: 'Impossibile creare il task' };
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETATO' ? new Date() : null,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { error: 'Impossibile aggiornare lo stato' };
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error: 'Impossibile eliminare il task' };
  }
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
