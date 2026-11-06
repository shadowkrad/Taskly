import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizePhone, parseDataNascita } from "@/lib/phone";
import { cercaClientePerTelefono } from "@/lib/clienti-telefono";

/** Elenco clienti (con ricerca per nome, telefono o email). */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  await ensureDatabaseSchema();

  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  const cifre = q.replace(/\D/g, "");
  const clienti = await prisma.customer.findMany({
    where: {
      phone: { not: "CANCELLATO" },
      ...(q
        ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, ...(cifre.length >= 3 ? [{ phone: { contains: cifre } }] : [])] }
        : {}),
    },
    orderBy: { name: "asc" },
    take: 300,
  });
  return NextResponse.json({ clienti });
}

/** Nuovo cliente: un numero, un cliente. */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  await ensureDatabaseSchema();

  const b = await req.json().catch(() => null);
  const nome = String(b?.name || "").trim();
  const telefono = String(b?.phone || "").trim();
  if (!nome || !telefono) return NextResponse.json({ error: "Nome e telefono sono obbligatori" }, { status: 400 });

  const esistente = await cercaClientePerTelefono(telefono);
  if (esistente) {
    return NextResponse.json(
      { error: `Questo numero è già registrato per ${esistente.name}`, clienteEsistenteId: esistente.id },
      { status: 409 }
    );
  }
  const nascita = b.birthDate ? parseDataNascita(String(b.birthDate)) : null;
  if (b.birthDate && !nascita) return NextResponse.json({ error: "Data di nascita non valida" }, { status: 400 });

  const cliente = await prisma.customer.create({
    data: {
      name: nome,
      phone: normalizePhone(telefono) || telefono,
      email: String(b.email || "").trim() || null,
      address: String(b.address || "").trim() || null,
      notes: String(b.notes || "").trim() || null,
      birthDate: nascita,
      marketingConsent: Boolean(b.marketingConsent),
      loyaltyPoints: 0,
    },
  });
  return NextResponse.json({ cliente }, { status: 201 });
}
