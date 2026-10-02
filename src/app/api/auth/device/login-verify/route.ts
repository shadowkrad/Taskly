import { NextResponse } from "next/server";
import { verifyDeviceLoginAndAuthenticate } from "@/lib/device-auth";

export async function POST(request: Request) {
  try {
    const { response, expectedChallenge } = await request.json();

    if (!response || !expectedChallenge) {
      return NextResponse.json({ error: "Parametri incompleti." }, { status: 400 });
    }

    const result = await verifyDeviceLoginAndAuthenticate(request, response, expectedChallenge);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[login-verify] Errore:", err);
    return NextResponse.json({ error: err.message || "Autenticazione fallita" }, { status: 403 });
  }
}
