import { prisma, ensureDatabaseSchema } from './prisma';

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
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
  },
  contact: {
    phone: '+39 340 1234567',
    email: 'info@taskly.taaaac.eu',
  },
};

/**
 * Recupera la configurazione del tenant da Taaaac Core
 * GET https://taaaac.eu/api/public/tenant-config?domain=[domain]&token=[token]
 */
export async function fetchTenantConfig(): Promise<TenantConfig> {
  const domain =
    process.env.TAAAAC_TENANT_DOMAIN ||
    process.env.TAAAAC_DOMAIN ||
    process.env.NEXT_PUBLIC_TAAAAC_DOMAIN ||
    'taskly-demo.taaaac.eu';
  const token =
    process.env.TAAAAC_TENANT_TOKEN ||
    process.env.TAAAAC_TOKEN ||
    'demo-token-taskly';
  const baseUrl = process.env.TAAAAC_CORE_URL || 'https://taaaac.eu';

  let cached: any = null;
  try {
    await ensureDatabaseSchema();
    cached = await prisma.tenantLocalCache.findUnique({
      where: { id: 'singleton' },
    });
  } catch {}

  let config: TenantConfig = {
    ...DEFAULT_TENANT_CONFIG,
    domain,
    theme: { ...DEFAULT_TENANT_CONFIG.theme },
    contact: { ...DEFAULT_TENANT_CONFIG.contact },
  };

  try {
    const url = `${baseUrl}/api/public/tenant-config?domain=${encodeURIComponent(
      domain
    )}&token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const tenantNode = data?.tenant || {};
      const rawAddons: string[] = Array.isArray(data?.addons)
        ? data.addons
        : Array.isArray(data?.enabledModules)
        ? data.enabledModules
        : Array.isArray(tenantNode?.moduliAttivi)
        ? tenantNode.moduliAttivi
        : DEFAULT_TENANT_CONFIG.addons;

      const mergedAddons = Array.from(
        new Set([
          ...rawAddons,
          ...(tenantNode?.whatsappEnabled ? ['WHATSAPP', 'WHATSAPP_REMINDERS'] : []),
        ])
      );

      config = {
        domain:
          data?.domain ||
          (tenantNode?.sottodominio
            ? `${tenantNode.sottodominio}.taaaac.eu`
            : domain),
        licenseStatus:
          ((data?.licenseStatus || tenantNode?.stato) as LicenseStatus) || 'ATTIVO',
        licenseExpiry: data?.licenseExpiry || tenantNode?.dataScadenza,
        addons: mergedAddons,
        theme: {
          brandName:
            data?.theme?.brandName ||
            tenantNode?.nomeAttivita ||
            DEFAULT_TENANT_CONFIG.theme.brandName,
          clientLogo: data?.theme?.clientLogo || data?.theme?.logoUrl,
          faviconUrl: data?.theme?.faviconUrl,
          primaryColor:
            data?.theme?.primaryColor || DEFAULT_TENANT_CONFIG.theme.primaryColor,
          accentColor:
            data?.theme?.accentColor || DEFAULT_TENANT_CONFIG.theme.accentColor,
        },
        contact: {
          phone:
            data?.contact?.phone ||
            data?.phone ||
            tenantNode?.whatsappDisplayNumber ||
            DEFAULT_TENANT_CONFIG.contact?.phone,
          email: data?.contact?.email || DEFAULT_TENANT_CONFIG.contact?.email,
        },
        metadata: data?.metadata,
      };
    }
  } catch (error) {
    console.warn('[Taaaac Core] Eccezione durante il fetch tenant-config:', error);
  }

  // Override con cache SQLite locale
  if (cached) {
    if (cached.brandName) config.theme.brandName = cached.brandName;
    if (cached.logoUrl) config.theme.clientLogo = cached.logoUrl;
    if (cached.faviconUrl) config.theme.faviconUrl = cached.faviconUrl;
    if (cached.primaryColor) config.theme.primaryColor = cached.primaryColor;
    if (cached.accentColor) config.theme.accentColor = cached.accentColor;
    const resolvedPhone =
      cached.phone || config.contact?.phone || '+39 340 1234567';
    const resolvedEmail =
      cached.email || cached.contactEmail || config.contact?.email;
    config.contact = {
      ...config.contact,
      phone: resolvedPhone,
      email: resolvedEmail,
    };
  }

  return config;
}
