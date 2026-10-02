import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";

/**
 * GET /api/settings/devices
 * Ritorna l'elenco dei dispositivi PWA registrati
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const devices = await prisma.registeredDevice.findMany({
      orderBy: { registeredAt: "desc" },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        status: true,
        registeredAt: true,
        lastUsedAt: true,
      },
    });

    return NextResponse.json({ devices });
  } catch (err: any) {
    console.error("[settings/devices GET] Errore:", err);
    return NextResponse.json({ error: "Errore durante il recupero dei dispositivi" }, { status: 500 });
  }
}

/**
 * DELETE /api/settings/devices
 * Scollega o elimina un dispositivo registrato da remoto
 */
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("id");
    const action = searchParams.get("action") || "revoke"; // "revoke" o "delete"

    if (!deviceId) {
      return NextResponse.json({ error: "ID dispositivo mancante" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.registeredDevice.delete({
        where: { id: deviceId },
      });
      return NextResponse.json({ success: true, message: "Dispositivo eliminato definitivamente." });
    } else {
      // Revoca (status: REVOKED) per bloccare istantaneamente l'accesso biometrico
      await prisma.registeredDevice.update({
        where: { id: deviceId },
        data: { status: "REVOKED" },
      });
      return NextResponse.json({ success: true, message: "Dispositivo scollegato e revocato con successo." });
    }
  } catch (err: any) {
    console.error("[settings/devices DELETE] Errore:", err);
    return NextResponse.json({ error: err.message || "Errore durante l'operazione sul dispositivo" }, { status: 500 });
  }
}
