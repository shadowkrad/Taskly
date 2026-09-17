/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = 'file:./dev.db';
}

try {
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.warn('[Taskly Postinstall] Avviso prisma generate:', e.message);
}
