import { NextResponse } from "next/server";
import { getDeviceRegistrationOptions } from "@/lib/device-auth";
import { getSession } from "@/app/actions/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Devi essere autenticato per registrare un nuovo dispositivo sicuro." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const userName = body.userName || session.email || "Amministratore Taskly";

    const options = await getDeviceRegistrationOptions(request, userName);
    return NextResponse.json(options);
  } catch (err: any) {
    console.error("[register-options] Errore:", err);
    return NextResponse.json({ error: err.message || "Errore del server" }, { status: 500 });
  }
}
