/**
 * Fonte unica dei dati dell'attività (Taskly).
 *
 * - Nome, sede, telefono, email, descrizione e ORARI si modificano SOLO in Impostazioni
 *   (scheda Attività per i dati, scheda Orari & Reperibilità per gli orari).
 *   Vetrina, piè di pagina e invio a Google / Facebook / Instagram li leggono da lì.
 * - Colori e logo si modificano SOLO nello Studio Aspetto.
 * Lo Studio mostra questi dati in sola lettura e decide soltanto cosa far vedere (interruttori).
 */
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";
import { parseShowcaseConfig, ShowcaseConfig } from "@/lib/showcase-defaults";
import type { OmnichannelDayHours, OmnichannelSpecialClosure } from "@/lib/omnichannel-client";

export const ORARI_FERIALI_DEFAULT = "08:00 – 12:30 / 14:00 – 18:30";
export const ORARI_SABATO_DEFAULT = "08:30 – 13:00 (Pronto Intervento)";
export const ORARI_DOMENICA_DEFAULT = "Chiuso (Solo Emergenze)";

/** Trasforma un testo tipo "08:00 – 12:30 / 14:00 – 18:30" nelle fasce di apertura ("Chiuso" = nessuna fascia). */
export function leggiFasce(testo: string | null | undefined): Array<{ open: string; close: string }> {
  if (!testo || /chiuso/i.test(testo)) return [];
  const fasce: Array<{ open: string; close: string }> = [];
  for (const parte of testo.split("/")) {
    const m = parte.match(/(\d{1,2}[:.]\d{2})\s*[-–—]\s*(\d{1,2}[:.]\d{2})/);
    if (m) {
      fasce.push({
        open: m[1].replace(".", ":").padStart(5, "0"),
        close: m[2].replace(".", ":").padStart(5, "0"),
      });
    }
  }
  return fasce;
}

/**
 * Orari ufficiali nel formato di Google Maps / Facebook / Instagram.
 * Con il Pronto Intervento H24 attivo l'attività risulta aperta tutti i giorni 24 ore su 24.
 */
export function orariUfficialiPerCanali(cache: any | null): OmnichannelDayHours[] {
  const giorni: OmnichannelDayHours["dayOfWeek"][] = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
  ];
  if (cache?.h24Attivo) {
    return giorni.map((dayOfWeek) => ({ dayOfWeek, isOpen: true, slots: [{ open: "00:00", close: "23:59" }] }));
  }
  const feriali = leggiFasce(cache?.orariFeriali ?? ORARI_FERIALI_DEFAULT);
  const sabato = leggiFasce(cache?.orariSabato ?? ORARI_SABATO_DEFAULT);
  const domenica = leggiFasce(cache?.orariDomenica ?? ORARI_DOMENICA_DEFAULT);
  return giorni.map((dayOfWeek, i) => {
    const slots = i < 5 ? feriali : i === 5 ? sabato : domenica;
    return { dayOfWeek, isOpen: slots.length > 0, slots };
  });
}

/** Prossime chiusure straordinarie dal calendario eccezioni. */
export async function chiusureFuture(): Promise<OmnichannelSpecialClosure[]> {
  try {
    await ensureDatabaseSchema();
    const oggi = new Date().toISOString().slice(0, 10);
    const righe = await prisma.eccezioneCalendario.findMany({ where: { tipo: "CHIUSURA", data: { gte: oggi } } });
    return righe.map((e: any) => ({
      startDate: e.data,
      endDate: e.data,
      reason: e.titolo || "Chiusura Programmata",
      isClosedAllDay: true,
    }));
  } catch {
    return [];
  }
}

/** Porta nella vetrina i dati dell'attività, sovrascrivendo qualunque copia vecchia salvata nello Studio. */
export function applicaAnagrafica(showcase: ShowcaseConfig, cache: any | null): ShowcaseConfig {
  if (!cache) return showcase;
  const ci: any = { ...(showcase.contactInfo || {}) };
  if (cache.indirizzo?.trim()) ci.address = cache.indirizzo.trim();
  if (cache.phone?.trim()) ci.phone = cache.phone.trim();
  const email = (cache.email || cache.contactEmail || "").trim();
  if (email) ci.email = email;
  ci.hoursWeekday = `Lun - Ven: ${cache.orariFeriali?.trim() || ORARI_FERIALI_DEFAULT}`;
  ci.hoursWeekend = `Sabato: ${cache.orariSabato?.trim() || ORARI_SABATO_DEFAULT} • Domenica: ${
    cache.orariDomenica?.trim() || ORARI_DOMENICA_DEFAULT
  }`;
  if (cache.h24Attivo) ci.hoursNote = ci.hoursNote?.trim() || "Pronto Intervento H24";
  showcase.contactInfo = ci;
  if (cache.brandName?.trim()) showcase.brandName = cache.brandName.trim();
  return showcase;
}

/** Vetrina completa e coerente: Studio + dati dell'attività. */
export async function caricaVetrinaUnificata(): Promise<{ showcase: ShowcaseConfig; cache: any | null }> {
  await ensureDatabaseSchema();
  const cache = await prisma.tenantLocalCache.findUnique({ where: { id: "singleton" } });
  const showcase = applicaAnagrafica(parseShowcaseConfig((cache as any)?.showcaseConfig), cache);
  return { showcase, cache };
}

/** Riscrive la vetrina salvata con i dati dell'attività allineati (per chi legge direttamente il JSON salvato). */
export async function riallineaVetrinaSalvata(descrizione?: string): Promise<void> {
  const { showcase, cache } = await caricaVetrinaUnificata();
  if (!cache) return;
  if (descrizione !== undefined && descrizione.trim()) {
    showcase.about = { ...showcase.about, description: descrizione.trim() };
  }
  await prisma.tenantLocalCache.update({
    where: { id: "singleton" },
    data: { showcaseConfig: JSON.stringify(showcase) },
  });
}
