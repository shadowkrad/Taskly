// Crea il database della DEMO di Taskly (prisma/demo.db) con dati di fantasia: interventi, clienti (anche con telefono fisso),
// punti fedelta' sui lavori completati, buoni di ogni tipo e buoni compleanno gia' pronti.
// Le date sono relative a OGGI (da -45 a +21 giorni): si rigenera quando la demo invecchia.
//
// Uso:  node scripts/crea-demo-db.mjs      (oppure: npm run demo:rigenera)
// REGOLE: i link di tessere e buoni sono derivati da nomi/codici (sempre uguali), cosi' una rigenerazione
// non rompe i link gia' inviati. Mai dati demo nei database dei clienti veri.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "prisma", "demo.db");
const schemaTmp = path.join(root, "prisma", ".schema-demo.prisma");

// 1) Database nuovo con le tabelle esatte dello schema (stesso schema, altro file)
for (const f of [out, `${out}-journal`]) if (fs.existsSync(f)) fs.rmSync(f);
const schema = fs.readFileSync(path.join(root, "prisma", "schema.prisma"), "utf8").replace(/url\s*=\s*env\("DATABASE_URL"\)/, 'url      = "file:./demo.db"');
fs.writeFileSync(schemaTmp, schema);
try {
  execSync(`npx prisma db push --schema "${schemaTmp}" --skip-generate --accept-data-loss`, { cwd: root, stdio: "pipe" });
} finally {
  fs.rmSync(schemaTmp, { force: true });
}

const { PrismaClient } = await import("@prisma/client");
const sharp = (await import("sharp")).default;
const prisma = new PrismaClient({ datasources: { db: { url: `file:${out}` } } });

const tokenStabile = (seme) => createHash("sha256").update(`taskly-demo:${seme}`).digest("base64url").slice(0, 24);

let seed = 20261106;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

const oggi = new Date();
const giorno = (offset, ora = 0, min = 0) => new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + offset, ora, min, 0, 0);
const nascita = (anni, offsetGiorni) => {
  const t = giorno(offsetGiorni);
  return new Date(Date.UTC(t.getFullYear() - anni, t.getMonth(), t.getDate()));
};

async function main() {
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="190" fill="#1e1b4b"/><circle cx="200" cy="200" r="165" fill="none" stroke="#818cf8" stroke-width="8"/><text x="200" y="235" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="#c7d2fe">TK</text></svg>`;
  const logoDemo = "data:image/png;base64," + (await sharp(Buffer.from(logoSvg)).png().toBuffer()).toString("base64");

  await prisma.tenantLocalCache.create({
    data: {
      id: "singleton",
      brandName: "Taskly Manutenzioni",
      logoUrl: logoDemo,
      primaryColor: "#1e1b4b",
      accentColor: "#4f46e5",
      contactEmail: "info@taskly.taaaac.eu",
      phone: "0575 000500",
      fidelityEnabled: true,
      fidelityRules: JSON.stringify({
        enabled: true,
        pointsPerEuro: 1,
        welcomeBonusPoints: 15,
        minPointsToRedeem: 50,
        rewardVoucherMonths: 6,
        compleanno: { enabled: true, tipoValore: "IMPORTO", importo: 15, giorniAnticipo: 7, validitaGiorni: 30, spesaMinima: 50, inviaEmail: true },
        rewards: [
          { id: "rew_t1", name: "Diritto di Chiamata Urgente H24 Gratuito", pointsRequired: 50, rewardType: "FREE_ITEM", freeItemName: "Azzeramento costo fisso uscita tecnico per urgenze" },
          { id: "rew_t2", name: "Sconto 25€ su Manutenzione o Riparazione", pointsRequired: 120, rewardType: "DISCOUNT", discountAmount: 25 },
          { id: "rew_t3", name: "Check-up & Sanificazione Impianto Omaggio", pointsRequired: 200, rewardType: "FREE_ITEM", freeItemName: "Pulizia filtri e controllo fumi/pressione completo" },
        ],
      }),
    },
  });

  // ---- Clienti (numeri finti; alcuni fissi, formati misti, compleanni vicini) ----
  const clienti = [
    ["Laura Ferrari", "3201000101", "laura.ferrari@example.com", nascita(34, 2), "Via Roma 10, Arezzo"],
    ["Chiara Conti", "3201000102", "chiara.conti@example.com", nascita(29, 6), "Via Dante 4, Arezzo"],
    ["Elisa Greco", "3201000103", "elisa.greco@example.com", nascita(41, 12), "Via Mazzini 22, Arezzo"],
    ["Francesca Marino", "3201000104", null, nascita(37, 25), "Corso Italia 8, Arezzo"],
    ["Valentina Gallo", "3201000106", null, nascita(26, -3), "Via Piave 3, Arezzo"],
    ["Giorgia Santoro", "3201000109", "giorgia.santoro@example.com", nascita(31, 40), "Via Garibaldi 15, Arezzo"],
    ["Paola Rinaldi", "3201000111", "paola.rinaldi@example.com", nascita(52, 90), "Via Fiorentina 77, Arezzo"],
    ["Sofia Ferrara", "3201000113", null, nascita(23, 150), "Via Leonardo da Vinci 5, Arezzo"],
    ["Nadia Bindi", "3201000130", "nadia.bindi@example.com", nascita(39, 1), "Via Petrarca 12, Arezzo"],
    ["Marco Bianchi", "3331122334", "marco.bianchi@example.com", nascita(44, 33), "Via Vittorio Veneto 9, Arezzo"],
    ["Davide Moretti", "3499988776", "d.moretti@example.com", nascita(36, 75), "Via Guido Monaco 31, Arezzo"],
    ["Federico Galli", "3285544332", "fedegalli@example.com", null, "Via dei Mille 2, Arezzo"],
    ["Simone Fabbri", "3201000107", null, null, "Via Cesalpino 18, Arezzo"],
    ["Andrea Costa", "3201000108", "andrea.costa@example.com", nascita(28, 150), "Via Setteponti 40, Arezzo"],
    ["Riccardo Giuliani", "3201000110", null, null, "Via Margaritone 6, Arezzo"],
    ["Maria Bartolini", "0575100201", null, nascita(71, 18), "Via San Lorentino 1, Arezzo"],
    ["Rosa Cecchi", "0575100202", null, nascita(68, 60), "Via Madonna del Prato 14, Arezzo"],
    ["Franco Lucherini", "0575100203", null, nascita(75, 5), "Via Sansovino 20, Arezzo"],
    ["Mario Pieri", "0575100204", "mario.pieri@example.com", nascita(66, 220), "Via Alberti 11, Arezzo"],
    ["Tommaso Rossetti", "+39 320 100 0121", "tommaso.r@example.com", nascita(27, 130), "Via Crispi 7, Arezzo"],
    ["Filippo Conti", "0039 3201000122", null, null, "Via Pellicceria 3, Arezzo"],
    ["Daniele Mancini", "320-1000123", "daniele.m@example.com", null, "Via Spinello 25, Arezzo"],
    ["Alberto Rinaldi", "3201000125", "alberto.r@example.com", nascita(38, 33), "Via Giotto 8, Arezzo"],
    ["Enrico Bellini", "3201000127", "enrico.bellini@example.com", nascita(35, 180), "Via Tarlati 16, Arezzo"],
    ["Fabio Lombardi", "32010", null, null, "Via Nuova 5, Arezzo"], // numero incompleto: "Da verificare"
  ];
  const creati = [];
  for (const [name, phone, email, birthDate, address] of clienti) {
    creati.push(
      await prisma.customer.create({
        data: { name, phone, email, birthDate, address, marketingConsent: rnd() > 0.4, loyaltyPoints: 0, loyaltyToken: tokenStabile(`tessera:${name}`) },
      })
    );
  }

  // ---- Interventi (passati e futuri) e punti sui lavori completati ----
  const servizi = [
    ["Idraulica", "Perdita sotto il lavello della cucina", 60, 140],
    ["Elettrico", "Salvavita che scatta di continuo", 70, 180],
    ["Caldaie & Clima", "Manutenzione annuale caldaia", 80, 120],
    ["Serrature & Fabbro", "Sostituzione cilindro porta d'ingresso", 90, 160],
    ["Pronto Intervento", "Allagamento bagno, urgente", 120, 260],
  ];
  const punti = new Map();
  const accredita = async (cliente, importo, quando, rif) => {
    const p = Math.floor(importo);
    punti.set(cliente.id, (punti.get(cliente.id) || 0) + p);
    await prisma.movimentoPunti.create({
      data: {
        clienteId: cliente.id,
        punti: p,
        tipo: "ACCREDITO",
        origine: "APPUNTAMENTO",
        appuntamentoId: rif,
        importo,
        saldoDopo: punti.get(cliente.id),
        descrizione: `Intervento completato (+${p} pt)`,
        createdAt: quando,
      },
    });
  };
  for (const c of creati) {
    const n = Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const [serviceType, description, min, max] = pick(servizi);
      const off = -(1 + Math.floor(rnd() * 45));
      const costo = Math.round((min + rnd() * (max - min)) * 10) / 10;
      const stato = pick(["COMPLETATO", "COMPLETATO", "COMPLETATO", "COMPLETATO", "ANNULLATO"]);
      const r = await prisma.serviceRequest.create({
        data: {
          customerName: c.name,
          phone: c.phone,
          email: c.email,
          address: c.address || "Arezzo",
          serviceType,
          description,
          urgency: serviceType === "Pronto Intervento" ? "EMERGENZA" : pick(["ORDINARIO", "ORDINARIO", "URGENTE"]),
          status: stato,
          scheduledAt: giorno(off, 10),
          estimatedCost: costo,
          finalCost: stato === "COMPLETATO" ? costo : null,
          createdAt: giorno(off - 2, 9),
        },
      });
      if (stato === "COMPLETATO") await accredita(c, costo, giorno(off, 17), r.id);
    }
    if (rnd() < 0.35) {
      const [serviceType, description, min, max] = pick(servizi);
      await prisma.serviceRequest.create({
        data: {
          customerName: c.name,
          phone: c.phone,
          email: c.email,
          address: c.address || "Arezzo",
          serviceType,
          description,
          urgency: "ORDINARIO",
          status: pick(["IN_ATTESA", "PIANIFICATO"]),
          scheduledAt: giorno(Math.floor(rnd() * 21), 10),
          estimatedCost: Math.round((min + rnd() * (max - min)) * 10) / 10,
        },
      });
    }
  }

  // ---- Punti: un premio riscattato per chi ne ha abbastanza; saldo ----
  for (const c of creati) {
    let tot = punti.get(c.id) || 0;
    if (tot >= 150 && rnd() > 0.5) {
      await prisma.movimentoPunti.create({
        data: { clienteId: c.id, punti: 50, tipo: "RISCATTO", origine: "PREMIO", premioId: "rew_t1", saldoDopo: tot - 50, descrizione: "Premio: Diritto di Chiamata Urgente H24 Gratuito", createdAt: giorno(-3) },
      });
      tot -= 50;
    }
    await prisma.customer.update({ where: { id: c.id }, data: { loyaltyPoints: tot } });
  }

  // ---- Buoni di esempio ----
  const buoni = [
    ["BUO-DEMO1-REGAL", "REGALO", "IMPORTO", 50, 50, null, null, 120, null, "Giulia Moretti", "Marco Rossi", "Per la tua nuova casa!", null, true, null, "ATTIVA"],
    ["BUO-DEMO2-REGAL", "REGALO", "IMPORTO", 100, 60, null, null, 90, null, "Paola Rinaldi", "Andrea Ferrara", "Buon trasloco", null, true, null, "ATTIVA"],
    ["BUO-DEMO3-COMPE", "COMPENSAZIONE", "IMPORTO", 25, 25, null, null, null, 2, "", "", null, null, false, "Tecnico arrivato in ritardo", "ATTIVA"],
    ["BUO-DEMO5-SERVI", "GESTO_COMMERCIALE", "SERVIZIO", 0, 0, null, "Controllo impianto elettrico gratuito", 60, 7, "", "", null, null, false, "Cliente fedele da 3 anni", "ATTIVA"],
    ["BUO-DEMO6-PUNTI", "PREMIO_PUNTI", "IMPORTO", 25, 25, null, null, 14, 9, "", "", null, null, false, "Premio punti: Sconto 25€ (120 punti)", "ATTIVA"],
    ["BUO-DEMO7-SCADU", "SCONTO", "PERCENTUALE", 0, 0, 10, null, -10, null, "", "", null, 60, false, "Promozione di ottobre", "ATTIVA"],
    ["BUO-DEMO8-USATO", "REGALO", "IMPORTO", 30, 0, null, null, 200, null, "Anna Neri", "Luca Verdi", null, null, true, null, "RISCATTATA"],
  ];
  for (const [codice, motivo, tipoValore, importo, residuo, percentuale, servizio, giorniScad, idx, acquirente, beneficiario, messaggio, spesaMinima, usoParziale, nota, stato] of buoni) {
    const cl = idx != null ? creati[idx] : null;
    const g = await prisma.giftCard.create({
      data: {
        codice,
        tokenPubblico: tokenStabile(`buono:${codice}`),
        motivo,
        tipoValore,
        importoIniziale: importo,
        saldoResiduo: residuo,
        percentuale,
        descrizioneServizio: servizio,
        clienteId: cl ? cl.id : null,
        spesaMinima,
        usoParziale,
        note: nota,
        acquirenteNome: acquirente,
        beneficiarioNome: beneficiario || (cl ? cl.name : ""),
        beneficiarioMessaggio: messaggio,
        dataScadenza: giorniScad == null ? null : giorno(giorniScad),
        stato,
        creatoDa: "Staff",
      },
    });
    await prisma.movimentoGiftCard.create({
      data: { giftCardId: g.id, tipo: "EMISSIONE", importo, saldoDopo: importo, operatore: "Staff", note: "Emesso", createdAt: giorno(-20) },
    });
    if (tipoValore === "IMPORTO" && residuo < importo) {
      await prisma.movimentoGiftCard.create({
        data: { giftCardId: g.id, tipo: "USO", importo: importo - residuo, saldoDopo: residuo, operatore: "Staff", note: `Sconto di ${(importo - residuo).toFixed(2)} € in cassa`, createdAt: giorno(-8) },
      });
    }
  }

  // ---- Buoni compleanno "automatici" gia' creati per chi compie gli anni nei prossimi 7 giorni ----
  // (nella demo ogni copia del database e' separata: creandoli qui restano uguali ovunque e l'automatismo non crea doppioni)
  for (const c of creati) {
    if (!c.birthDate) continue;
    const inizioOggi = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
    let comp = new Date(oggi.getFullYear(), c.birthDate.getUTCMonth(), c.birthDate.getUTCDate());
    if (comp < inizioOggi) comp = new Date(oggi.getFullYear() + 1, c.birthDate.getUTCMonth(), c.birthDate.getUTCDate());
    if (comp > new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + 7)) continue;
    const codice = `BUO-COMP-${c.name.slice(0, 3).toUpperCase()}${comp.getFullYear()}`;
    const g = await prisma.giftCard.create({
      data: {
        codice,
        tokenPubblico: tokenStabile(`buono:${codice}`),
        motivo: "COMPLEANNO",
        tipoValore: "IMPORTO",
        importoIniziale: 15,
        saldoResiduo: 15,
        clienteId: c.id,
        spesaMinima: 50,
        usoParziale: false,
        note: `Buono compleanno ${comp.getFullYear()} (automatico)`,
        acquirenteNome: "Attività",
        beneficiarioNome: c.name,
        dataScadenza: new Date(comp.getTime() + 30 * 86400000),
        stato: "ATTIVA",
        creatoDa: "Automatico",
      },
    });
    await prisma.movimentoGiftCard.create({
      data: { giftCardId: g.id, tipo: "EMISSIONE", importo: 15, saldoDopo: 15, operatore: "Automatico", note: "Emesso: Buono compleanno", createdAt: giorno(-1) },
    });
    if (c.email && c.marketingConsent) {
      await prisma.movimentoGiftCard.create({
        data: { giftCardId: g.id, tipo: "INVIO", importo: 0, saldoDopo: 15, operatore: "Automatico", note: `Email simulata (demo) a ${c.email}`, createdAt: giorno(-1) },
      });
    }
  }

  const [nc, ni, nm] = await Promise.all([prisma.customer.count(), prisma.serviceRequest.count(), prisma.movimentoPunti.count()]);
  console.log(`Demo creata: ${out}`);
  console.log(`Clienti ${nc} | Interventi ${ni} | Movimenti punti ${nm}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
