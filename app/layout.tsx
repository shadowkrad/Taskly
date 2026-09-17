import type { Metadata } from 'next';
import './globals.css';
import { fetchTenantConfig } from '@/lib/taaaac';
import { TenantProvider } from '@/components/tenant-provider';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Taskly • Gestione Attività Modulare (Taaaac Ecosystem)',
  description: 'Applicativo verticale Taskly integrato con la console centrale Taaaac Core',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenantConfig = await fetchTenantConfig();

  return (
    <html lang="it">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <TenantProvider config={tenantConfig}>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
            {children}
          </main>
          <footer className="border-t border-slate-200/80 bg-white/50 py-6 text-center text-xs text-slate-400 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Taskly © {new Date().getFullYear()} — Modulo indipendente per Taaaac Core</span>
              <span>Progettato per Vercel & VPS Aruba Traefik SSL</span>
            </div>
          </footer>
        </TenantProvider>
      </body>
    </html>
  );
}
