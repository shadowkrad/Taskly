import { prisma } from "@/lib/prisma";

/** Impostazioni del brand nella forma usata dalle pagine pubbliche (tessera, icona, manifest) e dalle email. */
export async function leggiBrandTaskly() {
  const imp = await prisma.tenantLocalCache.findUnique({ where: { id: "singleton" } }).catch(() => null);
  return {
    brandName: imp?.brandName || "Taskly",
    accentColor: imp?.accentColor || "#4f46e5",
    primaryColor: imp?.primaryColor || "#1e1b4b",
    logoUrl: imp?.logoUrl || null,
    phone: imp?.phone || "",
  };
}
