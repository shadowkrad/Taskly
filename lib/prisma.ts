import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Assicuriamo che DATABASE_URL sia sempre valorizzato
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.VERCEL ? 'file:/tmp/dev.db' : 'file:./dev.db';
}

// Su Vercel Serverless, il filesystem dell'app è in sola lettura, tranne /tmp.
function setupVercelSqlite() {
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    try {
      if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
        if (fs.existsSync(/*turbopackIgnore: true*/ sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      }
    } catch (e) {
      console.warn('[Prisma Vercel] Inizializzazione storage /tmp:', e);
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
}

setupVercelSqlite();

const globalForPrisma = global as unknown as { prisma: PrismaClient; schemaInitialized?: boolean };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Assicura che lo schema delle tabelle esista in SQLite
 */
export async function ensureDatabaseSchema() {
  if (globalForPrisma.schemaInitialized) return;

  try {
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
    globalForPrisma.schemaInitialized = true;
  } catch (error) {
    console.warn('[ensureDatabaseSchema] Fallito bootstrap schema SQLite:', error);
  }
}

export default prisma;
