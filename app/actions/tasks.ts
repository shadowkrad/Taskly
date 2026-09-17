'use server';

import prisma from '@/lib/prisma';
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

export async function getTasks(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<TaskItem[]> {
  try {
    const whereClause: Record<string, any> = {};

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
    console.error('Error fetching tasks:', error);
    return [];
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
  const count = await prisma.task.count();
  if (count === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Configurare Traefik SSL per dominio cliente',
          description: 'Verificare router Traefik su VPS Aruba con certificato Let\'s Encrypt automatico.',
          status: 'IN_CORSO',
          priority: 'ALTA',
          category: 'DevOps & Cloud',
          dueDate: new Date(Date.now() + 86400000 * 2),
        },
        {
          title: 'Collegare Webhook Notifiche WhatsApp Taaaac Core',
          description: 'Inviare promemoria automatici 24h prima della scadenza attività.',
          status: 'DA_FARE',
          priority: 'ALTA',
          category: 'Integrazioni',
          dueDate: new Date(Date.now() + 86400000 * 4),
        },
        {
          title: 'Inizializzare database SQLite isolato per il tenant',
          description: 'Garantire che ogni istanza mantenga il database locale dev.db isolato e protetto.',
          status: 'COMPLETATO',
          priority: 'MEDIA',
          category: 'Database',
          completedAt: new Date(),
        },
        {
          title: 'Allineamento brand e palette dinamica',
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
}
