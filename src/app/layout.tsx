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
      icon: [
        { url: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/api/pwa-icon?size=180", sizes: "180x180", type: "image/png" }],
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
        <link rel="icon" href="/api/pwa-icon?size=192" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/api/pwa-icon?size=180" />
        <link rel="manifest" href="/manifest.webmanifest" />
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
