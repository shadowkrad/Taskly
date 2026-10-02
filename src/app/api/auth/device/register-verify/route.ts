import { NextResponse } from "next/server";
import { verifyDeviceRegistration } from "@/lib/device-auth";
import { getSession } from "@/app/actions/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Devi essere autenticato per registrare un dispositivo." },
        { status: 401 }
      );
    }

    const { response, expectedChallenge, deviceName, deviceType } = await request.json();

    if (!response || !expectedChallenge) {
      return NextResponse.json({ error: "Parametri incompleti." }, { status: 400 });
    }

    const result = await verifyDeviceRegistration(
      request,
      response,
      expectedChallenge,
      deviceName || "Dispositivo PWA",
      deviceType || "smartphone"
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[register-verify] Errore:", err);
    return NextResponse.json({ error: err.message || "Registrazione dispositivo fallita" }, { status: 400 });
  }
}
