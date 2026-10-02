import { NextResponse } from "next/server";
import { getDeviceLoginOptions } from "@/lib/device-auth";

export async function POST(request: Request) {
  try {
    const options = await getDeviceLoginOptions(request);
    return NextResponse.json(options);
  } catch (err: any) {
    console.error("[login-options] Errore:", err);
    return NextResponse.json({ error: err.message || "Errore del server" }, { status: 400 });
  }
}
