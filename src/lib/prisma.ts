import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Risoluzione dinamica del path database SQLite per Vercel, Docker Taaaac VPS o locale
function resolveDatabaseUrl(): string {
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

    globalForPrisma.schemaInitialized = true;
  } catch (error) {
    console.warn('[ensureDatabaseSchema] Fallito bootstrap schema SQLite:', error);
  }
}

export default prisma;
