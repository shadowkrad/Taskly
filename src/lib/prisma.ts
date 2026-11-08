import { PrismaClient } from '@prisma/client';
import { normalizePhone } from "@/lib/phone";
import fs from 'fs';
import path from 'path';

// Risoluzione dinamica del path database SQLite per Vercel, Docker Taaaac VPS o locale
function resolveDatabaseUrl(): string {
  // 0. Demo (ramo cliente-demo, Vercel): se c'e' prisma/demo.db con clienti, punti e buoni di prova la si copia in
  // una zona scrivibile e si usa quella. Senza demo.db o fuori da Vercel non cambia nulla.
  if (process.env.VERCEL) {
    const demoPath = path.join(process.cwd(), 'prisma', 'demo.db');
    if (fs.existsSync(demoPath)) {
      const tmpDemo = '/tmp/taskly-demo.db';
      try {
        const copiare =
          !fs.existsSync(tmpDemo) ||
          fs.statSync(demoPath).mtimeMs > fs.statSync(tmpDemo).mtimeMs ||
          fs.statSync(demoPath).size !== fs.statSync(tmpDemo).size;
        if (copiare) fs.copyFileSync(demoPath, tmpDemo);
        return `file:${tmpDemo}`;
      } catch (e) {
        console.warn('[Prisma Vercel] Copia database demo in /tmp:', e);
      }
    }
  }

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL;
  }

  // 1. Ambiente Vercel Serverless
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      }
    } catch (e) {
      console.warn('[Prisma Vercel] Inizializzazione storage /tmp:', e);
    }
    return `file:${tmpDbPath}`;
  }

  // 2. Ambiente Docker Taaaac VPS (volume standard /app/data)
  if (fs.existsSync('/app/data')) {
    return 'file:/app/data/taskly.db';
  }

  // 3. Sviluppo locale
  return 'file:./dev.db';
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = global as unknown as { prisma: PrismaClient; schemaInitialized?: boolean };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Assicura che lo schema completo delle tabelle esista in SQLite
 * (Previene crash 500 su Vercel Serverless o primi avvii di container Docker vuoti)
 */
export async function ensureDatabaseSchema() {
  if (globalForPrisma.schemaInitialized) return;

  try {
    // Tabella Task (retrocompatibilità)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'DA_FARE',
        "priority" TEXT NOT NULL DEFAULT 'MEDIA',
        "category" TEXT NOT NULL DEFAULT 'Generale',
        "dueDate" DATETIME,
        "completedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Task_status_idx" ON "Task"("status");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Task_priority_idx" ON "Task"("priority");
    `);

    // Tabella ServiceRequest (Richieste Intervento Artigiano / Tecnico)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ServiceRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "customerName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "email" TEXT,
        "address" TEXT NOT NULL,
        "serviceType" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "urgency" TEXT NOT NULL DEFAULT 'ORDINARIO',
        "status" TEXT NOT NULL DEFAULT 'IN_ATTESA',
        "preferredTime" TEXT,
        "scheduledAt" DATETIME,
        "estimatedCost" REAL,
        "finalCost" REAL,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ServiceRequest_status_idx" ON "ServiceRequest"("status");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ServiceRequest_urgency_idx" ON "ServiceRequest"("urgency");
    `);

    // Tabella WorkReport (Rapportini Tecnici Digitali)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WorkReport" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "serviceRequestId" TEXT NOT NULL,
        "hoursWorked" REAL NOT NULL DEFAULT 1.0,
        "hourlyRate" REAL NOT NULL DEFAULT 45.0,
        "materialsUsed" TEXT,
        "customerSignature" TEXT,
        "totalAmount" REAL NOT NULL DEFAULT 0.0,
        "paymentStatus" TEXT NOT NULL DEFAULT 'DA_PAGARE',
        "paymentMethod" TEXT,
        "technicianNotes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "WorkReport_serviceRequestId_idx" ON "WorkReport"("serviceRequestId");
    `);

    // Tabella TenantLocalCache
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TenantLocalCache" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
        "brandName" TEXT NOT NULL DEFAULT 'Taskly • Taaaac Suite',
        "logoUrl" TEXT,
        "faviconUrl" TEXT,
        "primaryColor" TEXT NOT NULL DEFAULT '#1e1b4b',
        "accentColor" TEXT NOT NULL DEFAULT '#4f46e5',
        "email" TEXT,
        "phone" TEXT,
        "showcaseConfig" TEXT DEFAULT '{}',
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hot-patch preventiva per database SQLite esistenti
    try {
      const info = (await prisma.$queryRawUnsafe(`PRAGMA table_info("TenantLocalCache");`)) as Array<{ name: string }>;
      const exists = Array.isArray(info) && info.some((col) => col.name.toLowerCase() === "showcaseconfig");
      if (!exists) {
        await prisma.$executeRawUnsafe(`ALTER TABLE "TenantLocalCache" ADD COLUMN "showcaseConfig" TEXT DEFAULT '{}';`);
      }
      const rispettaCol = Array.isArray(info) && info.some((col) => col.name.toLowerCase() === "rispettafestivitanazionali");
      if (!rispettaCol) {
        await prisma.$executeRawUnsafe(`ALTER TABLE "TenantLocalCache" ADD COLUMN "rispettaFestivitaNazionali" BOOLEAN DEFAULT 1;`);
      }
      // Dati attivita' e orari (1.1.2): sede, orari di presenza e Pronto Intervento H24
      for (const [col, def] of [
        ["indirizzo", "TEXT"],
        ["orariFeriali", "TEXT DEFAULT '08:00 – 12:30 / 14:00 – 18:30'"],
        ["orariSabato", "TEXT DEFAULT '08:30 – 13:00 (Pronto Intervento)'"],
        ["orariDomenica", "TEXT DEFAULT 'Chiuso (Solo Emergenze)'"],
        ["h24Attivo", "BOOLEAN NOT NULL DEFAULT 1"],
      ] as const) {
        if (!(Array.isArray(info) && info.some((c) => c.name.toLowerCase() === col.toLowerCase()))) {
          try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TenantLocalCache" ADD COLUMN "${col}" ${def};`);
          } catch {
            // colonna gia' creata da una richiesta in parallelo
          }
        }
      }
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "EccezioneCalendario" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "data" TEXT NOT NULL,
          "titolo" TEXT NOT NULL,
          "tipo" TEXT NOT NULL DEFAULT 'CHIUSURA',
          "isAperto" BOOLEAN NOT NULL DEFAULT 0,
          "orarioApertura" TEXT,
          "orarioChiusura" TEXT,
          "pausaInizio" TEXT,
          "pausaFine" TEXT,
          "note" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "EccezioneCalendario_data_key" ON "EccezioneCalendario"("data");
      `);
    } catch {}

    // Fidelity, buoni e clienti (1.1.2)
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Customer" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT,
          "address" TEXT,
          "notes" TEXT,
          "birthDate" DATETIME,
          "marketingConsent" BOOLEAN NOT NULL DEFAULT 0,
          "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
          "loyaltyToken" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "MovimentoPunti" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "clienteId" TEXT NOT NULL,
          "punti" INTEGER NOT NULL,
          "tipo" TEXT NOT NULL DEFAULT 'ACCREDITO',
          "origine" TEXT,
          "descrizione" TEXT,
          "importo" REAL,
          "appuntamentoId" TEXT,
          "premioId" TEXT,
          "saldoDopo" INTEGER,
          "operatore" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "MovimentoPunti_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "GiftCard" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "codice" TEXT NOT NULL,
          "importoIniziale" REAL NOT NULL,
          "saldoResiduo" REAL NOT NULL,
          "acquirenteNome" TEXT NOT NULL,
          "acquirenteEmail" TEXT,
          "acquirenteTelefono" TEXT,
          "beneficiarioNome" TEXT NOT NULL,
          "beneficiarioMessaggio" TEXT,
          "dataScadenza" DATETIME,
          "stato" TEXT NOT NULL DEFAULT 'ATTIVA',
          "motivo" TEXT NOT NULL DEFAULT 'REGALO',
          "tipoValore" TEXT NOT NULL DEFAULT 'IMPORTO',
          "percentuale" REAL,
          "descrizioneServizio" TEXT,
          "clienteId" TEXT,
          "spesaMinima" REAL,
          "usoParziale" BOOLEAN NOT NULL DEFAULT 1,
          "note" TEXT,
          "tokenPubblico" TEXT,
          "creatoDa" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "MovimentoGiftCard" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "giftCardId" TEXT NOT NULL,
          "importo" REAL NOT NULL,
          "tipo" TEXT,
          "saldoDopo" REAL,
          "operatore" TEXT,
          "note" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "MovimentoGiftCard_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "GiftCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
      for (const sql of [
        `CREATE UNIQUE INDEX IF NOT EXISTS "Customer_loyaltyToken_key" ON "Customer"("loyaltyToken")`,
        `CREATE INDEX IF NOT EXISTS "Customer_phone_idx" ON "Customer"("phone")`,
        `CREATE INDEX IF NOT EXISTS "MovimentoPunti_clienteId_idx" ON "MovimentoPunti"("clienteId")`,
        `CREATE INDEX IF NOT EXISTS "MovimentoPunti_appuntamentoId_idx" ON "MovimentoPunti"("appuntamentoId")`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "GiftCard_codice_key" ON "GiftCard"("codice")`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "GiftCard_tokenPubblico_key" ON "GiftCard"("tokenPubblico")`,
        `CREATE INDEX IF NOT EXISTS "GiftCard_stato_idx" ON "GiftCard"("stato")`,
        `CREATE INDEX IF NOT EXISTS "GiftCard_clienteId_idx" ON "GiftCard"("clienteId")`,
        `CREATE INDEX IF NOT EXISTS "MovimentoGiftCard_giftCardId_idx" ON "MovimentoGiftCard"("giftCardId")`,
      ]) {
        await prisma.$executeRawUnsafe(sql).catch(() => {});
      }

      // I clienti nascono dagli interventi: la prima volta si crea una scheda per ogni numero di telefono gia' presente
      if ((await prisma.customer.count()) === 0) {
        const richieste = await prisma.serviceRequest.findMany({ orderBy: { createdAt: "asc" } });
        const visti = new Set<string>();
        for (const r of richieste) {
          const n = normalizePhone(r.phone);
          if (!n || n.length < 6 || visti.has(n)) continue;
          visti.add(n);
          await prisma.customer.create({ data: { name: r.customerName, phone: n, email: r.email, address: r.address } });
        }
      }
    } catch (err) {
      console.warn('[ensureDatabaseSchema] Fidelity/buoni:', err);
    }

    globalForPrisma.schemaInitialized = true;
  } catch (error) {
    console.warn('[ensureDatabaseSchema] Fallito bootstrap schema SQLite:', error);
  }
}

export default prisma;
