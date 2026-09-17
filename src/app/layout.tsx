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
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
          </div>
        </TenantProvider>
      </body>
    </html>
  );
}
