import React from 'react';
import { HeroSection } from '@/components/public/HeroSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { BookingForm } from '@/components/public/BookingForm';
import { PublicFooter } from '@/components/public/PublicFooter';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero con chiamata rapida WhatsApp e Telefono */}
      <HeroSection />

      {/* 2. Listino e Griglia Servizi */}
      <ServicesSection />

      {/* 3. Form di Prenotazione e Urgenze 24h */}
      <BookingForm />

      {/* 4. Footer con orari e contatti */}
      <PublicFooter />
    </div>
  );
}
