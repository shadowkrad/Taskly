import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { setAdminSession } from "@/lib/auth";

export const RP_NAME = "Taskly Pro • Taaaac";

export function getRpId(request: Request): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost";
  return host.split(":")[0];
}

export function getOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Salva una challenge WebAuthn temporanea nel database (valida 5 minuti)
 */
export async function saveChallenge(challenge: string, type: "registration" | "authentication"): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.webAuthnChallenge.create({
    data: {
      challenge,
      type,
      expiresAt,
    },
  });
}

/**
 * Recupera e rimuove una challenge WebAuthn per prevenire attacchi di replay
 */
export async function consumeChallenge(challenge: string, type: "registration" | "authentication"): Promise<boolean> {
  const record = await prisma.webAuthnChallenge.findFirst({
    where: {
      challenge,
      type,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return false;

  await prisma.webAuthnChallenge.delete({
    where: { id: record.id },
  }).catch(() => null);

  return true;
}

/**
 * Genera le opzioni per la registrazione di un nuovo dispositivo sicuro
 */
export async function getDeviceRegistrationOptions(request: Request, userName: string = "Amministratore Taskly") {
  const rpID = getRpId(request);

  // Ottieni i dispositivi già registrati per escluderli
  const existingDevices = await prisma.registeredDevice.findMany({
    where: { status: "ACTIVE" },
    select: { credentialId: true, transports: true },
  });

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName,
    userDisplayName: userName,
    attestationType: "none",
    excludeCredentials: existingDevices.map((d) => ({
      id: d.credentialId,
      transports: d.transports ? (JSON.parse(d.transports) as any) : undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  await saveChallenge(options.challenge, "registration");

  return options;
}

/**
 * Verifica la risposta di registrazione e salva il dispositivo autorizzato nel DB
 */
export async function verifyDeviceRegistration(
  request: Request,
  response: any,
  expectedChallenge: string,
  deviceName: string,
  deviceType: string = "smartphone"
) {
  const rpID = getRpId(request);
  const origin = getOrigin(request);

  const isValidChallenge = await consumeChallenge(expectedChallenge, "registration");
  if (!isValidChallenge) {
    throw new Error("Challenge scaduta o non valida. Riprova la registrazione.");
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Verifica biometrica / FIDO2 fallita.");
  }

  const { credential } = verification.registrationInfo;

  // Codifica publicKey in base64 per archiviazione in SQLite
  const publicKeyBase64 = Buffer.from(credential.publicKey).toString("base64");

  const device = await prisma.registeredDevice.create({
    data: {
      deviceName: deviceName.trim() || "Dispositivo PWA",
      credentialId: credential.id,
      publicKey: publicKeyBase64,
      counter: BigInt(credential.counter),
      transports: credential.transports ? JSON.stringify(credential.transports) : null,
      deviceType,
      status: "ACTIVE",
      lastUsedAt: new Date(),
    },
  });

  return { verified: true, deviceId: device.id, deviceName: device.deviceName };
}

/**
 * Genera le opzioni per il login con dispositivo autorizzato (FaceID, PIN, impronta)
 */
export async function getDeviceLoginOptions(request: Request) {
  const rpID = getRpId(request);

  const activeDevices = await prisma.registeredDevice.findMany({
    where: { status: "ACTIVE" },
    select: { credentialId: true, transports: true },
  });

  if (activeDevices.length === 0) {
    throw new Error("Nessun dispositivo autorizzato trovato. Effettua il primo accesso con password e registra il tuo smartphone.");
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: activeDevices.map((d) => ({
      id: d.credentialId,
      transports: d.transports ? (JSON.parse(d.transports) as any) : undefined,
    })),
  });

  await saveChallenge(options.challenge, "authentication");

  return options;
}

/**
 * Verifica la firma biometrica del dispositivo, controlla lo stato e avvia la sessione
 */
export async function verifyDeviceLoginAndAuthenticate(
  request: Request,
  response: any,
  expectedChallenge: string
) {
  const rpID = getRpId(request);
  const origin = getOrigin(request);

  const isValidChallenge = await consumeChallenge(expectedChallenge, "authentication");
  if (!isValidChallenge) {
    throw new Error("Challenge scaduta o non valida. Riprova.");
  }

  const device = await prisma.registeredDevice.findUnique({
    where: { credentialId: response.id },
  });

  if (!device) {
    throw new Error("Dispositivo sconosciuto o non registrato.");
  }

  if (device.status !== "ACTIVE") {
    throw new Error("Questo dispositivo è stato SCOLLEGATO dall'amministratore. Accesso negato.");
  }

  const publicKeyUint8 = new Uint8Array(Buffer.from(device.publicKey, "base64"));

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: device.credentialId,
      publicKey: publicKeyUint8,
      counter: Number(device.counter),
      transports: device.transports ? (JSON.parse(device.transports) as any) : undefined,
    },
  });

  if (!verification.verified) {
    throw new Error("Firma biometrica non valida.");
  }

  // Aggiorna contatore e timestamp
  await prisma.registeredDevice.update({
    where: { id: device.id },
    data: {
      counter: BigInt(verification.authenticationInfo.newCounter),
      lastUsedAt: new Date(),
    },
  });

  // Crea e imposta cookie di sessione Taskly
  await setAdminSession();

  return { verified: true, deviceName: device.deviceName };
}
