import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });

    if (config) {
      return NextResponse.json({
        nomeAttivita: config.brandName,
        logoUrl: config.logoUrl || "",
        faviconUrl: config.faviconUrl || "",
        colorePrimario: config.primaryColor,
        coloreAccento: config.accentColor,
        emailUfficio: config.email || "",
        telefonoUrgenze: config.phone || "",
      });
    }

    return NextResponse.json({
      nomeAttivita: "Taskly Impianti & Servizi",
      logoUrl: "",
      faviconUrl: "",
      colorePrimario: "#1e1b4b",
      coloreAccento: "#4f46e5",
      emailUfficio: "assistenza@tasklyimpianti.it",
      telefonoUrgenze: "+39 340 1234567",
    });
  } catch (error) {
    console.error("Errore recupero impostazioni Taskly:", error);
    return NextResponse.json({ error: "Errore nel recupero impostazioni" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeAttivita, logoUrl, faviconUrl, colorePrimario, coloreAccento, emailUfficio, telefonoUrgenze } = body;

    const updated = await prisma.tenantLocalCache.upsert({
      where: { id: "singleton" },
      update: {
        ...(nomeAttivita !== undefined && { brandName: String(nomeAttivita) }),
        ...(logoUrl !== undefined && { logoUrl: String(logoUrl || "") }),
        ...(faviconUrl !== undefined && { faviconUrl: String(faviconUrl || "") }),
        ...(colorePrimario !== undefined && { primaryColor: String(colorePrimario) }),
        ...(coloreAccento !== undefined && { accentColor: String(coloreAccento) }),
        ...(emailUfficio !== undefined && { email: String(emailUfficio) }),
        ...(telefonoUrgenze !== undefined && { phone: String(telefonoUrgenze) }),
      },
      create: {
        id: "singleton",
        brandName: nomeAttivita || "Taskly Impianti & Servizi",
        logoUrl: logoUrl || "",
        faviconUrl: faviconUrl || "",
        primaryColor: colorePrimario || "#1e1b4b",
        accentColor: coloreAccento || "#4f46e5",
        email: emailUfficio || "",
        phone: telefonoUrgenze || "",
      },
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error("Errore salvataggio impostazioni Taskly:", error);
    return NextResponse.json({ error: "Errore nel salvataggio" }, { status: 500 });
  }
}
