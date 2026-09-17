'use server';

import { prisma, ensureDatabaseSchema } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
export type { TaskItem } from '@/lib/tasks';

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
    revalidatePath('/');
    return { success: true };
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await ensureDatabaseSchema();
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
    revalidatePath('/');
    return { success: false, error: 'Impossibile aggiornare lo stato' };
  }
}

export async function deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await ensureDatabaseSchema();
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    revalidatePath('/');
    return { success: false, error: 'Impossibile eliminare il task' };
  }
}
