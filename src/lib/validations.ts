import { z } from 'zod';

export const serviceRequestSchema = z.object({
  customerName: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri').max(100),
  phone: z.string().min(6, 'Inserisci un numero di telefono valido').max(30),
  email: z.string().email('Email non valida').optional().or(z.literal('')),
  address: z.string().min(5, 'Inserisci indirizzo e numero civico completo').max(255),
  serviceType: z.string().min(2, 'Seleziona un tipo di intervento'),
  description: z.string().min(5, 'Descrivi brevemente il problema o la richiesta').max(2000),
  urgency: z.enum(['ORDINARIO', 'URGENTE', 'EMERGENZA']).default('ORDINARIO'),
  preferredTime: z.string().optional(),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

export const workReportSchema = z.object({
  serviceRequestId: z.string().min(1, 'ID intervento mancante'),
  hoursWorked: z.coerce.number().min(0.25, 'Le ore lavorate devono essere almeno 0.25').max(100),
  hourlyRate: z.coerce.number().min(0, 'La tariffa oraria non può essere negativa').default(45),
  materialsUsed: z.string().optional().default(''),
  customerSignature: z.string().optional(),
  totalAmount: z.coerce.number().min(0),
  paymentStatus: z.enum(['DA_PAGARE', 'SALDATO']).default('DA_PAGARE'),
  paymentMethod: z.enum(['CONTANTI', 'POS', 'BONIFICO']).optional().or(z.literal('')),
  technicianNotes: z.string().optional(),
});

export type WorkReportInput = z.infer<typeof workReportSchema>;

export const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['IN_ATTESA', 'PIANIFICATO', 'IN_CORSO', 'COMPLETATO', 'ANNULLATO']),
  scheduledAt: z.string().optional().nullable(),
  estimatedCost: z.coerce.number().optional().nullable(),
  finalCost: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
