/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

// Se DATABASE_URL è vuoto, indefinito o contiene solo spazi, impostalo a SQLite locale
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('[Taskly Build] DATABASE_URL impostato a:', process.env.DATABASE_URL);

try {
  console.log('[Taskly Build] Esecuzione prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.error('[Taskly Build] Errore prisma generate:', e);
}

try {
  console.log('[Taskly Build] Esecuzione prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.warn('[Taskly Build] Avviso prisma db push (non bloccante):', e.message);
}

console.log('[Taskly Build] Esecuzione next build...');
execSync('npx next build', { stdio: 'inherit', env: process.env });
