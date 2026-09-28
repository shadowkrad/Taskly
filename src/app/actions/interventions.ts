'use server';

import { revalidatePath } from 'next/cache';
import { prisma, ensureDatabaseSchema } from '@/lib/prisma';
import { sendNotificationMail } from '@/lib/taaaac-mailer';
import {
  serviceRequestSchema,
  workReportSchema,
  updateStatusSchema,
  type ServiceRequestInput,
  type WorkReportInput,
  type UpdateStatusInput,
} from '@/lib/validations';

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Invia una nuova richiesta di intervento da parte del cliente (Area Pubblica)
 */
export async function createServiceRequest(
  rawData: ServiceRequestInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = serviceRequestSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: 'Dati di richiesta non validi. Correggi i campi indicati.',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await ensureDatabaseSchema();

    const data = validated.data;
    const newRequest = await prisma.serviceRequest.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        serviceType: data.serviceType,
        description: data.description,
        urgency: data.urgency,
        preferredTime: data.preferredTime || null,
        status: 'IN_ATTESA',
      },
    });

    if (data.email) {
      sendNotificationMail({
        to: data.email,
        subject: `Richiesta di Intervento Ricevuta — Taskly Manutenzioni`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #bfdbfe; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #2563eb; margin-top: 0;">🔧 Richiesta di Intervento Ricevuta!</h2>
            <p style="color: #334155; font-size: 15px;">Gentile <strong>${data.customerName}</strong>,</p>
            <p style="color: #475569; font-size: 14px;">Abbiamo ricevuto la tua richiesta di assistenza per <strong>${data.serviceType}</strong> e il nostro team tecnico la sta prendendo in carico.</p>
            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
              <p style="margin: 4px 0; color: #1e3a8a;"><strong>Indirizzo:</strong> ${data.address}</p>
              <p style="margin: 4px 0; color: #1e3a8a;"><strong>Urgenza:</strong> ${data.urgency}</p>
              <p style="margin: 4px 0; color: #1e3a8a;"><strong>Descrizione guasto:</strong> ${data.description}</p>
              ${data.preferredTime ? `<p style="margin: 4px 0; color: #1e3a8a;"><strong>Orario preferito:</strong> ${data.preferredTime}</p>` : ""}
            </div>
            <p style="color: #64748b; font-size: 13px;">Un nostro tecnico ti contatterà al numero telefonico fornito per confermare l'orario di arrivo.</p>
          </div>
        `,
        senderName: "Taskly Manutenzioni",
      }).catch((mailErr) => console.error("Errore invio email Taskly:", mailErr));
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Richiesta di intervento inoltrata con successo! Verrai ricontattato a breve.',
      data: { id: newRequest.id },
    };
  } catch (error) {
    console.error('[createServiceRequest] Errore salvataggio:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'invio della richiesta. Riprova più tardi.',
    };
  }
}

/**
 * Aggiorna lo stato, data appuntamento o note dell'intervento (Area Riservata Tecnico)
 */
export async function updateServiceRequestStatus(
  rawData: UpdateStatusInput
): Promise<ActionResponse> {
  try {
    const validated = updateStatusSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: 'Dati non validi per l\'aggiornamento.',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await ensureDatabaseSchema();
    const data = validated.data;

    await prisma.serviceRequest.update({
      where: { id: data.id },
      data: {
        status: data.status,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        estimatedCost: data.estimatedCost !== undefined ? data.estimatedCost : undefined,
        finalCost: data.finalCost !== undefined ? data.finalCost : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
    });

    revalidatePath('/admin');
    return {
      success: true,
      message: 'Stato intervento aggiornato con successo.',
    };
  } catch (error) {
    console.error('[updateServiceRequestStatus] Errore:', error);
    return {
      success: false,
      message: 'Impossibile aggiornare l\'intervento.',
    };
  }
}

/**
 * Crea e registra il Rapportino Digitale di Lavoro con ore, materiali e totale
 */
export async function createWorkReport(
  rawData: WorkReportInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = workReportSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: 'Dati del rapportino non validi.',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await ensureDatabaseSchema();
    const data = validated.data;

    const report = await prisma.workReport.create({
      data: {
        serviceRequestId: data.serviceRequestId,
        hoursWorked: data.hoursWorked,
        hourlyRate: data.hourlyRate,
        materialsUsed: data.materialsUsed || null,
        customerSignature: data.customerSignature || null,
        totalAmount: data.totalAmount,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod || null,
        technicianNotes: data.technicianNotes || null,
      },
    });

    // Aggiorna lo stato dell'intervento a COMPLETATO e registra il costo finale
    await prisma.serviceRequest.update({
      where: { id: data.serviceRequestId },
      data: {
        status: 'COMPLETATO',
        finalCost: data.totalAmount,
      },
    });

    revalidatePath('/admin');
    return {
      success: true,
      message: 'Rapportino di lavoro emesso e registrato con successo!',
      data: { id: report.id },
    };
  } catch (error) {
    console.error('[createWorkReport] Errore:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'emissione del rapportino.',
    };
  }
}

/**
 * Elimina una richiesta di intervento
 */
export async function deleteServiceRequest(id: string): Promise<ActionResponse> {
  try {
    await ensureDatabaseSchema();
    await prisma.serviceRequest.delete({
      where: { id },
    });

    revalidatePath('/admin');
    return {
      success: true,
      message: 'Richiesta eliminata.',
    };
  } catch (error) {
    console.error('[deleteServiceRequest] Errore:', error);
    return {
      success: false,
      message: 'Errore durante l\'eliminazione.',
    };
  }
}
