import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
        telegramSettings: {
          enabled: Boolean(config.telegramEnabled),
          botToken: config.telegramBotToken || "",
          botUsername: config.telegramBotUsername || "",
          staffChatId: config.telegramStaffChatId || "",
        },
        fidelitySettings: {
          enabled: Boolean(config.fidelityEnabled),
          pointsPerEuro: fidelityRules?.pointsPerEuro || 1,
          welcomeBonusPoints: fidelityRules?.welcomeBonusPoints || 15,
          minPointsToRedeem: fidelityRules?.minPointsToRedeem || 50,
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
      telegramSettings: {
        enabled: false,
        botToken: "",
        botUsername: "",
        staffChatId: "",
      },
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
    const body = await req.json();
    const { nomeAttivita, logoUrl, faviconUrl, colorePrimario, coloreAccento, emailUfficio, telefonoUrgenze, telegramSettings, fidelitySettings } = body;

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
        ...(telegramSettings?.enabled !== undefined && { telegramEnabled: Boolean(telegramSettings.enabled) }),
        ...(telegramSettings?.botToken !== undefined && { telegramBotToken: telegramSettings.botToken }),
        ...(telegramSettings?.botUsername !== undefined && { telegramBotUsername: telegramSettings.botUsername }),
        ...(telegramSettings?.staffChatId !== undefined && { telegramStaffChatId: telegramSettings.staffChatId }),
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
        telegramEnabled: Boolean(telegramSettings?.enabled),
        telegramBotToken: telegramSettings?.botToken || null,
        telegramBotUsername: telegramSettings?.botUsername || null,
        telegramStaffChatId: telegramSettings?.staffChatId || null,
        fidelityEnabled: Boolean(fidelitySettings?.enabled),
        fidelityRules: fidelitySettings ? JSON.stringify(fidelitySettings) : "{}",
      },
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error("Errore salvataggio impostazioni Taskly:", error);
    return NextResponse.json({ error: "Errore nel salvataggio" }, { status: 500 });
  }
}
