export interface TrustBadgeItem {
  id: string;
  icon: "star" | "shield" | "award" | "clock" | "check";
  text: string;
}

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption?: string;
}

export interface ShowcaseContactInfo {
  address?: string;
  addressNote?: string;
  phone?: string;
  email?: string;
  hoursWeekday?: string;
  hoursWeekend?: string;
  hoursNote?: string;
  responseNote?: string;
  brandClaim?: string;
  guaranteeText?: string;
}

export interface ShowcaseConfig {
  brandName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;

  // Sezione Hero
  hero: {
    badgeText: string;
    title: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    coverImageUrl?: string | null;
    overlayOpacity: number; // 0 - 100
  };

  // Trust Badges
  trustBadges: TrustBadgeItem[];

  // Sezione Chi Siamo / Squadra Tecnica
  about: {
    enabled: boolean;
    title: string;
    subtitle: string;
    description: string;
    imageUrl?: string | null;
    quoteText?: string;
    quoteAuthor?: string;
  };

  // Galleria Fotografica
  gallery: {
    enabled: boolean;
    title: string;
    subtitle: string;
    images: GalleryPhotoItem[];
  };

  // Sezioni & Titoli
  sections: {
    showHero: boolean;
    showTrustBadges: boolean;
    showServices: boolean;
    showGallery: boolean;
    showAbout: boolean;
    showHours: boolean;
    showContact: boolean;
  };

  // Informazioni di Contatto & Orari
  contactInfo?: ShowcaseContactInfo;

  // Etichette Personalizzate
  customLabels: {
    servicesTitle: string;
    servicesSubtitle: string;
    hoursTitle: string;
    contactTitle: string;
  };
}

export const DEFAULT_TASKLY_CONTACT_INFO: ShowcaseContactInfo = {
  address: "Sede Operativa Territoriale",
  addressNote: "Disponibilità interventi tempestivi in tutta la provincia.",
  phone: "+39 340 1234567",
  email: "assistenza@taskly-impianti.it",
  hoursWeekday: "Lun - Ven: 07:30 - 19:30",
  hoursWeekend: "Sabato: 08:00 - 18:00",
  hoursNote: "Pronto Intervento H24 • Interventi tempestivi in loco",
  responseNote: "Reperibilità 24/7 per emergenze e guasti bloccanti.",
  brandClaim: "Servizio di pronto intervento specializzato per abitazioni, condomini e aziende. Tecnici qualificati con rilascio di dichiarazione di conformità e rapportino digitale.",
  guaranteeText: "Assicurazione RC Professionale e garanzia certificata sui ricambi.",
};

export const DEFAULT_TASKLY_SHOWCASE_CONFIG: ShowcaseConfig = {
  brandName: "Taskly Impianti & Pronto Intervento",
  primaryColor: "#1e1b4b",
  accentColor: "#4f46e5",
  logoUrl: null,
  faviconUrl: null,

  hero: {
    badgeText: "🔧 Pronto Intervento H24 Certificato • Privati & Imprese",
    title: "Pronto Intervento & Assistenza Tecnica a Domicilio",
    subtitle:
      "Idraulica, impianti elettrici, riparazione caldaie, climatizzatori e apertura porte. Intervento rapido garantito in meno di 60 minuti con tecnici abilitati D.M. 37/08.",
    ctaPrimaryText: "Richiedi Pronto Intervento ⚡",
    ctaSecondaryText: "I Nostri Servizi & Tariffe",
    coverImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1280&q=80",
    overlayOpacity: 80,
  },

  trustBadges: [
    { id: "tb1", icon: "clock", text: "Arrivo Rapido in 60 min" },
    { id: "tb2", icon: "shield", text: "Garanzia 24 Mesi sui Ricambi" },
    { id: "tb3", icon: "award", text: "Tecnici Abilitati D.M. 37/08" },
  ],

  about: {
    enabled: true,
    title: "La Nostra Squadra Tecnica",
    subtitle: "Competenza, Attrezzature d'Avanguardia & Prezzi Trasparenti",
    description:
      "Operiamo da oltre 15 anni nel settore delle manutenzioni e dell'assistenza tecnica d'urgenza. I nostri tecnici viaggiano su furgoni-officina completamente attrezzati con ricambi originali per risolvere guasti complessi già al primo sopralluogo.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    quoteText:
      "Un guasto improvviso non deve fermare la tua giornata: tempestività, sicurezza e correttezza sono la nostra priorità.",
    quoteAuthor: "Alessio Guidelli — Responsabile Tecnico Abilitato",
  },

  gallery: {
    enabled: true,
    title: "I Nostri Interventi & Parco Mezzi",
    subtitle: "Scorci dei nostri furgoni-officina, riparazioni certificate e installazioni a regola d'arte",
    images: [
      {
        id: "g1",
        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        caption: "Diagnostica guasti idraulici e riparazione perdite",
      },
      {
        id: "g2",
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        caption: "Certificazione e manutenzione quadri elettrici a norma",
      },
      {
        id: "g3",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        caption: "Furgone officina attrezzato con ricambi originali",
      },
      {
        id: "g4",
        url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80",
        caption: "Manutenzione caldaie e sanificazione climatizzatori",
      },
    ],
  },

  sections: {
    showHero: true,
    showTrustBadges: true,
    showServices: true,
    showGallery: true,
    showAbout: true,
    showHours: true,
    showContact: true,
  },

  customLabels: {
    servicesTitle: "Settori d'Intervento & Listino",
    servicesSubtitle: "Interventi ordinari e pronto intervento con tariffe chiare e nessun costo nascosto.",
    hoursTitle: "Reperibilità & Pronto Intervento H24",
    contactTitle: "Centrale Operativa & Contatti",
  },
};

/**
 * Parsing sicuro con deep-merge dei valori mancanti con i default
 */
export function parseShowcaseConfig(raw: string | null | undefined): ShowcaseConfig {
  if (!raw || typeof raw !== "string" || raw.trim() === "" || raw === "{}") {
    return { ...DEFAULT_TASKLY_SHOWCASE_CONFIG };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TASKLY_SHOWCASE_CONFIG,
      ...parsed,
      hero: {
        ...DEFAULT_TASKLY_SHOWCASE_CONFIG.hero,
        ...(parsed.hero || {}),
      },
      trustBadges: Array.isArray(parsed.trustBadges)
        ? parsed.trustBadges
        : DEFAULT_TASKLY_SHOWCASE_CONFIG.trustBadges,
      about: {
        ...DEFAULT_TASKLY_SHOWCASE_CONFIG.about,
        ...(parsed.about || {}),
      },
      gallery: {
        ...DEFAULT_TASKLY_SHOWCASE_CONFIG.gallery,
        ...(parsed.gallery || {}),
        images: Array.isArray(parsed.gallery?.images)
          ? parsed.gallery.images
          : DEFAULT_TASKLY_SHOWCASE_CONFIG.gallery.images,
      },
      sections: {
        ...DEFAULT_TASKLY_SHOWCASE_CONFIG.sections,
        ...(parsed.sections || {}),
      },
      contactInfo: {
        ...DEFAULT_TASKLY_CONTACT_INFO,
        ...(parsed.contactInfo || {}),
      },
      customLabels: {
        ...DEFAULT_TASKLY_SHOWCASE_CONFIG.customLabels,
        ...(parsed.customLabels || {}),
      },
    };
  } catch {
    return { ...DEFAULT_TASKLY_SHOWCASE_CONFIG };
  }
}
