import type { Metadata } from 'next';
import './globals.css';
import { fetchTenantConfig } from '@/lib/taaaac';
import { TenantProvider } from '@/components/tenant-provider';
import { Navbar } from '@/components/navbar';

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchTenantConfig();
  const brand = config.theme.brandName || "Assistenza Tecnica & Interventi";
  return {
    title: {
      default: brand,
      template: `%s | ${brand}`,
    },
    description: `Richiesta interventi, assistenza tecnica e manutenzione per ${brand}`,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: config.theme.faviconUrl || "/icon.svg",
      apple: config.theme.faviconUrl || "/icon.svg",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: brand,
    },
  };
}

export const viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenantConfig = await fetchTenantConfig();

  return (
    <html lang="it">
      <head>
        <link rel="icon" href={tenantConfig.theme.faviconUrl || "/icon.svg"} />
        <link rel="apple-touch-icon" href={tenantConfig.theme.faviconUrl || "/icon.svg"} />
      </head>
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
