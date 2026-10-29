import { MetadataRoute } from "next";
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let brandName = "Taskly";
  let themeColor = "#4f46e5";

  try {
    await ensureDatabaseSchema();
    const cache = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });
    if (cache?.brandName) {
      brandName = cache.brandName;
    }
    if (cache?.accentColor) {
      themeColor = cache.accentColor;
    }
  } catch (err) {
    console.error("[PWA Manifest Taskly] Fallback su default:", err);
  }

  return {
    name: `${brandName} — Gestionale Interventi & Assistenza`,
    short_name: brandName,
    description: `Modulo gestionale interventi tecnici e ordini di lavoro per ${brandName}, parte dell'ecosistema Taaaac.`,
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: themeColor,
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
