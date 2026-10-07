import { prisma } from './prisma';

export type LicenseStatus = 'ATTIVO' | 'SOSPESO' | 'IN_SCADENZA';

export type TaaaacAddon =
  | 'WHATSAPP_REMINDERS'
  | 'LOYALTY_CARD'
  | 'VENDOLY_CHANNEL_MANAGER'
  | 'TASKLY_AUTOMATIONS'
  | 'ADVANCED_REPORTS'
  | string;

export interface TenantTheme {
  brandName: string;
  clientLogo?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
}

export interface TenantConfig {
  domain: string;
  licenseStatus: LicenseStatus;
  licenseExpiry?: string;
  addons: TaaaacAddon[];
  theme: TenantTheme;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  metadata?: Record<string, unknown>;
}

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  domain: 'taskly-demo.taaaac.eu',
  licenseStatus: 'ATTIVO',
  licenseExpiry: '2027-12-31',
  addons: [
    'WHATSAPP_REMINDERS',
    'TASKLY_AUTOMATIONS',
    'ADVANCED_REPORTS'
  ],
  theme: {
    brandName: 'Taskly • Taaaac Suite',
    primaryColor: '#4f46e5', // Indigo Taaaac
    accentColor: '#06b6d4',  // Cyan
  },
};

/**
 * Recupera la configurazione del tenant da Taaaac Core
 * GET https://taaaac.eu/api/public/tenant-config?domain=[domain]&token=[token]
 */
export async function fetchTenantConfig(): Promise<TenantConfig> {
  const domain = process.env.TAAAAC_DOMAIN || process.env.NEXT_PUBLIC_TAAAAC_DOMAIN || 'taskly-demo.taaaac.eu';
  const token = process.env.TAAAAC_TOKEN || '';
  const baseUrl = process.env.TAAAAC_CORE_URL || 'https://taaaac.eu';

  let config: TenantConfig = {
    ...DEFAULT_TENANT_CONFIG,
    domain,
  };

  if (token) {
    try {
      const url = `${baseUrl}/api/public/tenant-config?domain=${encodeURIComponent(domain)}&token=${encodeURIComponent(token)}`;
      const res = await fetch(url, {
        next: { revalidate: 300 }, // cache 5 minuti
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        config = {
          domain: data.domain || domain,
          licenseStatus: (data.licenseStatus as LicenseStatus) || 'ATTIVO',
          licenseExpiry: data.licenseExpiry,
          addons: Array.isArray(data.addons) ? data.addons : DEFAULT_TENANT_CONFIG.addons,
          theme: {
            brandName: data.theme?.brandName || DEFAULT_TENANT_CONFIG.theme.brandName,
            clientLogo: data.theme?.clientLogo,
            faviconUrl: data.theme?.faviconUrl,
            primaryColor: data.theme?.primaryColor || DEFAULT_TENANT_CONFIG.theme.primaryColor,
            accentColor: data.theme?.accentColor || DEFAULT_TENANT_CONFIG.theme.accentColor,
          },
          metadata: data.metadata,
        };
      }
    } catch (error) {
      console.warn('[Taaaac Core] Eccezione durante il fetch tenant-config:', error);
    }
  }

  // Override con cache SQLite locale
  try {
    const cached = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });
    if (cached) {
      if (cached.brandName) config.theme.brandName = cached.brandName;
      if (cached.logoUrl) config.theme.clientLogo = cached.logoUrl;
      if (cached.faviconUrl) config.theme.faviconUrl = cached.faviconUrl;
      if (cached.primaryColor) config.theme.primaryColor = cached.primaryColor;
      if (cached.accentColor) config.theme.accentColor = cached.accentColor;
    }
  } catch {
    // silente se db non ancora inizializzato
  }

  return config;
}
