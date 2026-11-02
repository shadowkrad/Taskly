import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secretHeader = req.headers.get("x-taaaac-core-secret");
  const expectedSecret = process.env.TAAAAC_INTERNAL_SECRET || "taaaac-internal-key";

  if (!secretHeader || secretHeader !== expectedSecret) {
    return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const targetDateStr = searchParams.get("date");

  let targetDate = new Date();
  if (targetDateStr) {
    targetDate = new Date(targetDateStr);
  } else {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const rawRequests = await prisma.serviceRequest.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ["PIANIFICATO", "IN_ATTESA", "IN_CORSO"] },
      },
      orderBy: { scheduledAt: "asc" },
    });

    const appointments = rawRequests.map((reqItem) => {
      const scheduledDate = reqItem.scheduledAt || new Date();
      const hours = String(scheduledDate.getHours()).padStart(2, "0");
      const minutes = String(scheduledDate.getMinutes()).padStart(2, "0");
      const orario = reqItem.preferredTime || `${hours}:${minutes}`;

      return {
        id: reqItem.id,
        clienteNome: reqItem.customerName,
        clienteTelefono: reqItem.phone,
        clienteEmail: reqItem.email || null,
        data: scheduledDate.toISOString().split("T")[0],
        orario,
        servizio: `${reqItem.serviceType} (${reqItem.address})`,
        operatore: "Tecnico Incaricato",
        note: reqItem.notes || reqItem.description || null,
      };
    });

    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err: any) {
    console.error("[Internal Appointments Taskly] Errore:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
