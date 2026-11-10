import FloatingWhatsAppWidget from "@/components/public/FloatingWhatsAppWidget";
import type { Metadata } from 'next';
import './globals.css';
import { fetchTenantConfig } from '@/lib/taaaac';
import { getPwaIconVersion, pwaIconUrl } from '@/lib/pwa-icon-version';
import { headers } from 'next/headers';
import { TenantProvider } from '@/components/tenant-provider';
import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [config, v] = await Promise.all([
    fetchTenantConfig(),
    getPwaIconVersion(),
  ]);
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
        { url: pwaIconUrl(32, v), sizes: "32x32", type: "image/png" },
        { url: pwaIconUrl(192, v), sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: pwaIconUrl(180, v), sizes: "180x180", type: "image/png" }],
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
  const [tenantConfig, v] = await Promise.all([
    fetchTenantConfig(),
    getPwaIconVersion(),
  ]);

  const hasWhatsAppModule =
    Array.isArray(tenantConfig.addons) &&
    tenantConfig.addons.some((m) => String(m).toUpperCase().includes("WHATSAPP"));

  const waPhone = tenantConfig.contact?.phone || "+39 340 1234567";

  // La tessera del cliente ha icona (logo) e manifest propri, impostati dalla sua pagina
  const eTessera = ((await headers()).get('x-pathname') || '').startsWith('/tessera/');

  return (
    <html lang="it">
      <head>
        {!eTessera && (
          <>
            <link rel="icon" type="image/png" sizes="32x32" href={pwaIconUrl(32, v)} />
            <link rel="icon" type="image/png" sizes="192x192" href={pwaIconUrl(192, v)} />
            <link rel="apple-touch-icon" sizes="180x180" href={pwaIconUrl(180, v)} />
            <link rel="manifest" href="/manifest.webmanifest" />
          </>
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <TenantProvider config={tenantConfig}>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1 w-full">
              {children}
              {hasWhatsAppModule && (
                <FloatingWhatsAppWidget
                  phone={waPhone}
                  brandName={tenantConfig.theme.brandName || "Taskly"}
                />
              )}
            </main>
          </div>
        </TenantProvider>
      </body>
    </html>
  );
}
