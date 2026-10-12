import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDatabaseSchema } from "@/lib/prisma";
import { parseShowcaseConfig, ShowcaseConfig, DEFAULT_TASKLY_SHOWCASE_CONFIG } from "@/lib/showcase-defaults";

export async function GET() {
  try {
    await ensureDatabaseSchema();
    const cache = await prisma.tenantLocalCache.findUnique({
      where: { id: "singleton" },
    });

    const parsedConfig = parseShowcaseConfig((cache as any)?.showcaseConfig);

    // Sincronizza fallbacks con i dati di TenantLocalCache
    if (cache?.brandName && (!parsedConfig.brandName || parsedConfig.brandName === DEFAULT_TASKLY_SHOWCASE_CONFIG.brandName)) {
      parsedConfig.brandName = cache.brandName;
    }
    if (cache?.logoUrl && !parsedConfig.logoUrl) {
      parsedConfig.logoUrl = cache.logoUrl;
    }
    if (cache?.faviconUrl && !parsedConfig.faviconUrl) {
      parsedConfig.faviconUrl = cache.faviconUrl;
    }
    if (cache?.primaryColor && (!parsedConfig.primaryColor || parsedConfig.primaryColor === "#1e1b4b")) {
      parsedConfig.primaryColor = cache.primaryColor;
    }
    if (cache?.accentColor && (!parsedConfig.accentColor || parsedConfig.accentColor === "#4f46e5")) {
      parsedConfig.accentColor = cache.accentColor;
    }

    return NextResponse.json({
      success: true,
      config: parsedConfig,
    });
  } catch (error) {
    console.error("Errore fetch showcase config Taskly:", error);
    return NextResponse.json(
      { success: false, config: parseShowcaseConfig(null) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDatabaseSchema();
    const body: ShowcaseConfig = await req.json();

    const serializedConfig = JSON.stringify(body);

    const updateData: any = {
      showcaseConfig: serializedConfig,
    };

    if (body.brandName?.trim()) {
      updateData.brandName = body.brandName.trim();
    }
    if (body.primaryColor?.trim()) {
      updateData.primaryColor = body.primaryColor.trim();
    }
    if (body.accentColor?.trim()) {
      updateData.accentColor = body.accentColor.trim();
    }
    if (body.logoUrl !== undefined) {
      updateData.logoUrl = body.logoUrl;
    }
    if (body.faviconUrl !== undefined) {
      updateData.faviconUrl = body.faviconUrl;
    }

    await prisma.tenantLocalCache.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        brandName: body.brandName || "Taskly Impianti & Pronto Intervento",
        primaryColor: body.primaryColor || "#1e1b4b",
        accentColor: body.accentColor || "#4f46e5",
        ...updateData,
      },
      update: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Vetrina Taskly salvata con successo",
      config: body,
    });
  } catch (error) {
    console.error("Errore salvataggio vetrina Taskly:", error);
    return NextResponse.json(
      { error: "Errore durante il salvataggio della vetrina" },
      { status: 500 }
    );
  }
}
