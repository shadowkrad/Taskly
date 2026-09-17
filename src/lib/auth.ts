// Gestione autenticazione e sessioni sicure per Taskly (Taaaac Ecosystem)

const SESSION_COOKIE_NAME = 'taskly_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'taskly-taaaac-secret-jwt-key-2026-safe';

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@taskly.it',
  password: process.env.ADMIN_PASSWORD || 'Admin123!',
};

export interface SessionData {
  email: string;
  role: 'admin';
  exp: number;
}

// Helper di codifica Base64URL compatibile sia con Node che con Edge runtime
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(b64url: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64url, 'base64url').toString('utf-8');
  }
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  return atob(b64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Crea un token HMAC-SHA256 firmato per la sessione
 */
export async function createSessionToken(email: string): Promise<string> {
  const data: SessionData = {
    email,
    role: 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // Valido 7 giorni
  };

  const payload = JSON.stringify(data);
  const b64Payload = base64UrlEncode(payload);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(b64Payload));
  const b64Sig = arrayBufferToBase64Url(signature);

  return `${b64Payload}.${b64Sig}`;
}

/**
 * Verifica la validità del token di sessione
 */
export async function verifySessionToken(token?: string): Promise<SessionData | null> {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [b64Payload, b64Sig] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToUint8Array(b64Sig);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as ArrayBuffer,
      encoder.encode(b64Payload)
    );

    if (!isValid) return null;

    const jsonStr = base64UrlDecode(b64Payload);
    const session: SessionData = JSON.parse(jsonStr);

    if (session.exp && session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch (error) {
    console.warn('[verifySessionToken] Errore verifica sessione:', error);
    return null;
  }
}

export { SESSION_COOKIE_NAME };
