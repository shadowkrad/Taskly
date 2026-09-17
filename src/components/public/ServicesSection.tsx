import React from 'react';
import { Wrench, Zap, Flame, KeyRound, Hammer, AlertTriangle, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: Wrench,
    title: 'Idraulica & Disostruzioni',
    description: 'Riparazione perdite d\'acqua, sifoni, sostituzione rubinetteria, galleggianti WC e disostruzione scarichi intasati.',
    startingPrice: 'da 60€',
    color: 'text-sky-600 bg-sky-50',
    type: 'Idraulica',
  },
  {
    icon: Zap,
    title: 'Impianti Elettrici & Salvavita',
    description: 'Risoluzione cortocircuiti, ripristino quadri elettrici, sostituzione prese e interruttori, certificazione conformità.',
    startingPrice: 'da 70€',
    color: 'text-amber-600 bg-amber-50',
    type: 'Elettrico',
  },
  {
    icon: Flame,
    title: 'Caldaie, Scaldabagni & Clima',
    description: 'Controllo fumi e bollino blu, riparazione blocchi caldaia, ricarica gas condizionatori e sanificazione split.',
    startingPrice: 'da 90€',
    color: 'text-orange-600 bg-orange-50',
    type: 'Caldaie & Clima',
  },
  {
    icon: KeyRound,
    title: 'Fabbro & Apertura Porte',
    description: 'Apertura senza scasso per porte blindate bloccate, estrazione chiavi spezzate e cambio cilindro europeo di sicurezza.',
    startingPrice: 'da 80€',
    color: 'text-rose-600 bg-rose-50',
    type: 'Serrature & Fabbro',
  },
  {
    icon: Hammer,
    title: 'Montaggi & Piccole Riparazioni',
    description: 'Riparazione tapparelle, sostituzione cinghie e motorizzazioni, montaggio mensole, mobili, box doccia e infissi.',
    startingPrice: 'da 50€',
    color: 'text-indigo-600 bg-indigo-50',
    type: 'Riparazioni Generali',
  },
  {
    icon: AlertTriangle,
    title: 'Pronto Intervento 24/7 Urgenze',
    description: 'Disponibilità continua 24 ore su 24, anche festivi e fine settimana, per allagamenti gravi e guasti elettrici bloccanti.',
    startingPrice: 'da 95€',
    color: 'text-red-600 bg-red-50',
    type: 'Pronto Intervento 24/7',
  },
];

export function ServicesSection() {
  return (
    <section id="servizi" className="py-14 sm:py-18 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            I Nostri Servizi & Tariffe Indicative
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Interventi professionali eseguiti con attrezzature all&apos;avanguardia e ricambi originali coperti da garanzia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="card-taaaac hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${service.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                      {service.startingPrice}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Uscita inclusa con lavoro</span>
                  <a
                    href={`#prenota?tipo=${encodeURIComponent(service.type)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Prenota ora
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
