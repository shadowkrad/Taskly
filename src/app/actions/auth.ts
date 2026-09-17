'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_ADMIN_CREDENTIALS,
  type SessionData,
} from '@/lib/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
}

/**
 * Autenticazione con credenziali (Email + Password)
 */
export async function loginAction(
  email: string,
  password: string
): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const targetEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_CREDENTIALS.email).toLowerCase();
  const targetPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_CREDENTIALS.password;

  if (cleanEmail !== targetEmail || password !== targetPassword) {
    return {
      success: false,
      message: 'Email o password non corretti.',
    };
  }

  const token = await createSessionToken(cleanEmail);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 giorni
  });

  return {
    success: true,
  };
}

/**
 * Disconnessione e cancellazione cookie sessione
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

/**
 * Ottiene la sessione corrente verificata
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
