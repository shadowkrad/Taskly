import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Su Vercel Serverless, il filesystem dell'app è in sola lettura, tranne /tmp.
// Per abilitare le scritture (creazione/aggiornamento compiti nell'anteprima demo),
// predisponiamo il file SQLite in /tmp se siamo in ambiente Vercel.
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

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
