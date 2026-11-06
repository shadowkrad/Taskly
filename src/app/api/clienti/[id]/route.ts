import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizePhone, parseDataNascita } from "@/lib/phone";
import { cercaClientePerTelefono } from "@/lib/clienti-telefono";
import { assicuraTokenTessera } from "@/lib/fidelity";

type Ctx = { params: Promise<{ id: string }> };

/** Scheda completa: dati, ultimi movimenti punti, buoni attivi, link della tessera e interventi. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  await ensureDatabaseSchema();
  const { id } = await params;

  const cliente = await prisma.customer.findUnique({
    where: { id },
    include: { pointsMovements: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!cliente) return NextResponse.json({ error: "Cliente non trovato" }, { status: 404 });

  const tokenTessera = await assicuraTokenTessera(id);
  const ora = new Date();
  const [buoni, interventi] = await Promise.all([
    prisma.giftCard.findMany({
      where: { clienteId: id, stato: "ATTIVA", OR: [{ dataScadenza: null }, { dataScadenza: { gte: ora } }] },
      orderBy: { createdAt: "desc" },
      select: { id: true, codice: true, motivo: true, tipoValore: true, importoIniziale: true, saldoResiduo: true, percentuale: true, descrizioneServizio: true, dataScadenza: true },
    }),
    prisma.serviceRequest.findMany({
      where: { phone: { contains: cliente.phone.slice(-6) } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, serviceType: true, status: true, finalCost: true, estimatedCost: true, createdAt: true },
    }),
  ]);
  return NextResponse.json({ cliente: { ...cliente, tokenTessera }, buoni, interventi });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  await ensureDatabaseSchema();
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Dati non validi" }, { status: 400 });

  let telefono: string | undefined;
  if (b.phone !== undefined) {
    const t = String(b.phone).trim();
    if (!t) return NextResponse.json({ error: "Il telefono è obbligatorio" }, { status: 400 });
    const altro = await cercaClientePerTelefono(t, id);
    if (altro) {
      return NextResponse.json({ error: `Questo numero è già registrato per ${altro.name}`, clienteEsistenteId: altro.id }, { status: 409 });
    }
    telefono = normalizePhone(t) || t;
  }
  let nascita: Date | null | undefined;
  if (b.birthDate !== undefined) {
    if (b.birthDate) {
      nascita = parseDataNascita(String(b.birthDate));
      if (!nascita) return NextResponse.json({ error: "Data di nascita non valida" }, { status: 400 });
    } else {
      nascita = null;
    }
  }

  const cliente = await prisma.customer.update({
    where: { id },
    data: {
      ...(b.name !== undefined ? { name: String(b.name).trim() } : {}),
      ...(telefono !== undefined ? { phone: telefono } : {}),
      ...(b.email !== undefined ? { email: String(b.email || "").trim() || null } : {}),
      ...(b.address !== undefined ? { address: String(b.address || "").trim() || null } : {}),
      ...(b.notes !== undefined ? { notes: String(b.notes || "").trim() || null } : {}),
      ...(nascita !== undefined ? { birthDate: nascita } : {}),
      ...(b.marketingConsent !== undefined ? { marketingConsent: Boolean(b.marketingConsent) } : {}),
    },
  });
  return NextResponse.json({ cliente });
}

/** Cancellazione GDPR: i dati personali si azzerano, i movimenti contabili restano anonimi. */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  await ensureDatabaseSchema();
  const { id } = await params;
  await prisma.customer.update({
    where: { id },
    data: {
      name: "Cliente Anonimizzato",
      phone: "CANCELLATO",
      email: null,
      address: null,
      notes: null,
      birthDate: null,
      marketingConsent: false,
      loyaltyPoints: 0,
      loyaltyToken: null,
    },
  });
  return NextResponse.json({ success: true });
}
