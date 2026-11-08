import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";
import { fetchTenantConfig } from "@/lib/taaaac-client";
import { parseShowcaseConfig } from "@/lib/showcase-defaults";
import { riallineaVetrinaSalvata } from "@/lib/anagrafica-attivita";

/**
 * Telegram è gestito da Taaaac Core: qui si legge solo lo stato (mai token né chat ID).
 */
async function getTelegramHub() {
  try {
    const cfg = await fetchTenantConfig();
    return {
      managedByCore: true,
      enabled: Boolean(cfg.telegramEnabled),
      botUsername: cfg.telegramBotUsername || "",
      staffAlerts: cfg.telegramAutoConfirm !== false,
      reminder24h: cfg.telegramAutoReminder24h !== false,
    };
  } catch {
    return { managedByCore: true, enabled: false, botUsername: "", staffAlerts: true, reminder24h: true };
  }
}

export async function GET() {
  try {
    await ensureDatabaseSchema();
    const config = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });

    let fidelityRules = null;
    try {
      if (config?.fidelityRules) {
        fidelityRules = JSON.parse(config.fidelityRules);
      }
    } catch {
      fidelityRules = null;
    }

    if (config) {
      return NextResponse.json({
        nomeAttivita: config.brandName,
        logoUrl: config.logoUrl || "",
        faviconUrl: config.faviconUrl || "",
        colorePrimario: config.primaryColor,
        coloreAccento: config.accentColor,
        emailUfficio: config.email || "",
        telefonoUrgenze: config.phone || "",
        indirizzo: (config as any).indirizzo || "",
        descrizione: parseShowcaseConfig((config as any).showcaseConfig).about.description || "",
        orariFeriali: (config as any).orariFeriali || "08:00 – 12:30 / 14:00 – 18:30",
        orariSabato: (config as any).orariSabato || "08:30 – 13:00 (Pronto Intervento)",
        orariDomenica: (config as any).orariDomenica || "Chiuso (Solo Emergenze)",
        h24Attivo: (config as any).h24Attivo ?? true,
        telegramHub: await getTelegramHub(),
        fidelitySettings: {
          enabled: Boolean(config.fidelityEnabled),
          pointsPerEuro: fidelityRules?.pointsPerEuro || 1,
          welcomeBonusPoints: fidelityRules?.welcomeBonusPoints || 15,
          minPointsToRedeem: fidelityRules?.minPointsToRedeem || 50,
          rewardVoucherMonths: fidelityRules?.rewardVoucherMonths ?? 6,
          compleanno: fidelityRules?.compleanno,
          rewards: fidelityRules?.rewards || [
            { id: "rew_t1", name: "Diritto di Chiamata Urgente H24 Gratuito", pointsRequired: 50, rewardType: "FREE_ITEM", freeItemName: "Azzeramento costo fisso uscita tecnico per urgenze" },
            { id: "rew_t2", name: "Sconto 25€ su Manutenzione o Riparazione", pointsRequired: 120, rewardType: "DISCOUNT", discountAmount: 25 },
            { id: "rew_t3", name: "Check-up & Sanificazione Impianto Omaggio", pointsRequired: 200, rewardType: "FREE_ITEM", freeItemName: "Pulizia filtri e controllo fumi/pressione completo" },
          ],
        },
      });
    }

    return NextResponse.json({
      nomeAttivita: "Taskly Impianti & Servizi",
      logoUrl: "",
      faviconUrl: "",
      colorePrimario: "#1e1b4b",
      coloreAccento: "#4f46e5",
      emailUfficio: "assistenza@tasklyimpianti.it",
      telefonoUrgenze: "+39 340 1234567",
      indirizzo: "",
      descrizione: "",
      orariFeriali: "08:00 – 12:30 / 14:00 – 18:30",
      orariSabato: "08:30 – 13:00 (Pronto Intervento)",
      orariDomenica: "Chiuso (Solo Emergenze)",
      h24Attivo: true,
      telegramHub: await getTelegramHub(),
      fidelitySettings: {
        enabled: false,
        pointsPerEuro: 1,
        welcomeBonusPoints: 15,
        minPointsToRedeem: 50,
        rewards: [],
      },
    });
  } catch (error) {
    console.error("Errore recupero impostazioni Taskly:", error);
    return NextResponse.json({ error: "Errore nel recupero impostazioni" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDatabaseSchema();
    const body = await req.json();
    const { nomeAttivita, logoUrl, faviconUrl, colorePrimario, coloreAccento, emailUfficio, telefonoUrgenze, indirizzo, descrizione, orariFeriali, orariSabato, orariDomenica, h24Attivo, fidelitySettings } = body;

    const updated = await prisma.tenantLocalCache.upsert({
      where: { id: "singleton" },
      update: {
        ...(nomeAttivita !== undefined && { brandName: String(nomeAttivita) }),
        ...(logoUrl !== undefined && { logoUrl: String(logoUrl || "") }),
        ...(faviconUrl !== undefined && { faviconUrl: String(faviconUrl || "") }),
        ...(colorePrimario !== undefined && { primaryColor: String(colorePrimario) }),
        ...(coloreAccento !== undefined && { accentColor: String(coloreAccento) }),
        ...(emailUfficio !== undefined && { email: String(emailUfficio) }),
        ...(telefonoUrgenze !== undefined && { phone: String(telefonoUrgenze) }),
        ...(indirizzo !== undefined && { indirizzo: String(indirizzo) }),
        ...(orariFeriali !== undefined && { orariFeriali: String(orariFeriali) }),
        ...(orariSabato !== undefined && { orariSabato: String(orariSabato) }),
        ...(orariDomenica !== undefined && { orariDomenica: String(orariDomenica) }),
        ...(h24Attivo !== undefined && { h24Attivo: Boolean(h24Attivo) }),
        ...(fidelitySettings?.enabled !== undefined && { fidelityEnabled: Boolean(fidelitySettings.enabled) }),
        ...(fidelitySettings !== undefined && { fidelityRules: JSON.stringify(fidelitySettings) }),
      },
      create: {
        id: "singleton",
        brandName: nomeAttivita || "Taskly Impianti & Servizi",
        logoUrl: logoUrl || "",
        faviconUrl: faviconUrl || "",
        primaryColor: colorePrimario || "#1e1b4b",
        accentColor: coloreAccento || "#4f46e5",
        email: emailUfficio || "",
        phone: telefonoUrgenze || "",
        fidelityEnabled: Boolean(fidelitySettings?.enabled),
        fidelityRules: fidelitySettings ? JSON.stringify(fidelitySettings) : "{}",
      },
    });

    // Vetrina e invio ai canali leggono SEMPRE i dati appena salvati: riallinea la copia salvata nello Studio
    try {
      await riallineaVetrinaSalvata(typeof descrizione === "string" ? descrizione : undefined);
    } catch (e) {
      console.error("Riallineamento vetrina fallito:", e);
    }

    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error("Errore salvataggio impostazioni Taskly:", error);
    return NextResponse.json({ error: "Errore nel salvataggio" }, { status: 500 });
  }
}
