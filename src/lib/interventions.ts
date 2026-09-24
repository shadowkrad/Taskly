import { prisma, ensureDatabaseSchema } from './prisma';

export interface ServiceRequestItem {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  serviceType: string;
  description: string;
  urgency: 'ORDINARIO' | 'URGENTE' | 'EMERGENZA' | string;
  status: 'IN_ATTESA' | 'PIANIFICATO' | 'IN_CORSO' | 'COMPLETATO' | 'ANNULLATO' | string;
  preferredTime: string | null;
  scheduledAt: Date | null;
  estimatedCost: number | null;
  finalCost: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  workReports?: WorkReportItem[];
}

export interface WorkReportItem {
  id: string;
  serviceRequestId: string;
  hoursWorked: number;
  hourlyRate: number;
  materialsUsed: string | null;
  customerSignature: string | null;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  technicianNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const SAMPLE_SERVICE_REQUESTS: ServiceRequestItem[] = [
  {
    id: 'demo-req-1',
    customerName: 'Giulia Bianchi',
    phone: '+39 340 9876543',
    email: 'giulia.bianchi@example.com',
    address: 'Corso Italia 45, Milano',
    serviceType: 'Elettrico & Pronto Intervento',
    description: 'Scatto continuo del salvavita generale all\'accensione del forno o piano a induzione.',
    urgency: 'EMERGENZA',
    status: 'PIANIFICATO',
    preferredTime: 'Oggi pomeriggio (14:30)',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3),
    estimatedCost: 80,
    finalCost: null,
    notes: 'Accesso dal cortile interno, citofono 4B.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(),
    workReports: [],
  },
  {
    id: 'demo-req-2',
    customerName: 'Mario Rossi',
    phone: '+39 333 1234567',
    email: 'mario.rossi@example.com',
    address: 'Via Roma 12, Monza',
    serviceType: 'Idraulica & Riparazioni',
    description: 'Perdita importante sotto il lavello della cucina con allagamento mobiletto.',
    urgency: 'URGENTE',
    status: 'IN_CORSO',
    preferredTime: 'Mattina (subito)',
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60),
    estimatedCost: 110,
    finalCost: null,
    notes: 'Sostituzione sifone e raccordi flessibili.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(),
    workReports: [],
  },
  {
    id: 'demo-req-3',
    customerName: 'Studio Legale Ferrari',
    phone: '+39 02 7654321',
    email: 'segreteria@studioferrari.it',
    address: 'Viale Dante 8, Sesto San Giovanni',
    serviceType: 'Caldaie & Clima',
    description: 'Revisione annuale caldaia a condensazione e rilascio bollino blu con analisi fumi.',
    urgency: 'ORDINARIO',
    status: 'COMPLETATO',
    preferredTime: 'Flessibile',
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    estimatedCost: 120,
    finalCost: 120,
    notes: 'Intervento eseguito con successo. Rilasciata certificazione di conformità.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(),
    workReports: [
      {
        id: 'rep-demo-1',
        serviceRequestId: 'demo-req-3',
        hoursWorked: 1.5,
        hourlyRate: 50,
        materialsUsed: 'Filtro defangatore magnetico, guarnizioni tenuta',
        customerSignature: 'Studio Ferrari - Resp. Amm.',
        totalAmount: 120,
        paymentStatus: 'SALDATO',
        paymentMethod: 'POS',
        technicianNotes: 'Impianto in perfette condizioni di efficienza energetica.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
      },
    ],
  },
  {
    id: 'demo-req-4',
    customerName: 'Roberto Mancini',
    phone: '+39 328 1122334',
    email: null,
    address: 'Via Garibaldi 23, Milano',
    serviceType: 'Serrature & Fabbro',
    description: 'Chiave spezzata nel cilindro europeo della porta blindata, cliente rimasto fuori casa.',
    urgency: 'EMERGENZA',
    status: 'IN_ATTESA',
    preferredTime: 'Prima possibile',
    scheduledAt: null,
    estimatedCost: 150,
    finalCost: null,
    notes: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    updatedAt: new Date(),
    workReports: [],
  },
];

export async function getServiceRequests(filterStatus?: string): Promise<ServiceRequestItem[]> {
  try {
    await ensureDatabaseSchema();
    await seedSampleInterventionsIfEmpty();

    const whereClause: { status?: string } = {};
    if (filterStatus && filterStatus !== 'ALL') {
      whereClause.status = filterStatus;
    }

    const items = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        workReports: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    if (!items || items.length === 0) {
      if (process.env.IS_DEMO === 'false') {
        return [];
      }
      return filterStatus && filterStatus !== 'ALL'
        ? SAMPLE_SERVICE_REQUESTS.filter((r) => r.status === filterStatus)
        : SAMPLE_SERVICE_REQUESTS;
    }

    return items;
  } catch (error) {
    if (process.env.IS_DEMO === 'false') {
      console.warn('[getServiceRequests] Errore query in produzione:', error);
      return [];
    }
    console.warn('[getServiceRequests] Fallback a dati dimostrativi:', error);
    return filterStatus && filterStatus !== 'ALL'
      ? SAMPLE_SERVICE_REQUESTS.filter((r) => r.status === filterStatus)
      : SAMPLE_SERVICE_REQUESTS;
  }
}

export async function getServiceRequestById(id: string): Promise<ServiceRequestItem | null> {
  try {
    await ensureDatabaseSchema();
    const item = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        workReports: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (item) return item;
    return SAMPLE_SERVICE_REQUESTS.find((r) => r.id === id) || null;
  } catch (error) {
    console.warn('[getServiceRequestById] Fallback:', error);
    return SAMPLE_SERVICE_REQUESTS.find((r) => r.id === id) || null;
  }
}

export async function seedSampleInterventionsIfEmpty() {
  if (process.env.IS_DEMO === 'false') {
    return;
  }
  try {
    const count = await prisma.serviceRequest.count();
    if (count === 0) {
      for (const sample of SAMPLE_SERVICE_REQUESTS) {
        const created = await prisma.serviceRequest.create({
          data: {
            id: sample.id,
            customerName: sample.customerName,
            phone: sample.phone,
            email: sample.email,
            address: sample.address,
            serviceType: sample.serviceType,
            description: sample.description,
            urgency: sample.urgency,
            status: sample.status,
            preferredTime: sample.preferredTime,
            scheduledAt: sample.scheduledAt,
            estimatedCost: sample.estimatedCost,
            finalCost: sample.finalCost,
            notes: sample.notes,
          },
        });

        if (sample.workReports && sample.workReports.length > 0) {
          for (const rep of sample.workReports) {
            await prisma.workReport.create({
              data: {
                id: rep.id,
                serviceRequestId: created.id,
                hoursWorked: rep.hoursWorked,
                hourlyRate: rep.hourlyRate,
                materialsUsed: rep.materialsUsed,
                customerSignature: rep.customerSignature,
                totalAmount: rep.totalAmount,
                paymentStatus: rep.paymentStatus,
                paymentMethod: rep.paymentMethod,
                technicianNotes: rep.technicianNotes,
              },
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('[seedSampleInterventionsIfEmpty] Info:', e);
  }
}
