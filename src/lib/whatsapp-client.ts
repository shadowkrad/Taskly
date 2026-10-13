/**
 * WhatsApp Client Helper per Taskly (Idraulici, Elettricisti, Meccanici & Manutentori).
 * Client-safe, non carica Prisma o runtime server-side.
 */

export function formattaNumeroWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("3")) {
    return "39" + digits;
  }
  return digits;
}

export function generaLinkWhatsApp(phone: string, message: string): string {
  const cleanPhone = formattaNumeroWhatsApp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function apriWhatsAppWeb(phone: string, message: string): void {
  if (typeof window === "undefined") return;
  const url = generaLinkWhatsApp(phone, message);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function generaMessaggioInterventoRichiesta(dati: {
  azienda: string;
  nomeCliente: string;
  titoloIntervento: string;
  dataOra?: string;
  tecnico?: string;
}): string {
  let msg = `🔧 Ciao ${dati.nomeCliente}! Ti contattiamo da *${dati.azienda}* in merito all'intervento: *${dati.titoloIntervento}*.`;
  if (dati.dataOra) {
    msg += `\n📅 Programmato per: *${dati.dataOra}*`;
  }
  if (dati.tecnico) {
    msg += `\n👷 Tecnico incaricato: *${dati.tecnico}*`;
  }
  msg += `\n\nPer confermare o concordare l'orario, rispondi pure a questo messaggio. A presto!`;
  return msg;
}

export function generaMessaggioInterventoInArrivo(dati: {
  azienda: string;
  nomeCliente: string;
  tecnico?: string;
}): string {
  return `🚗 Ciao ${dati.nomeCliente}! Il tecnico di *${dati.azienda}*${dati.tecnico ? ` (${dati.tecnico})` : ""} è in arrivo per l'intervento. A tra poco! 🔧`;
}
