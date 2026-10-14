'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_ADMIN_CREDENTIALS,
  verifyAdminPassword,
  type SessionData,
} from '@/lib/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
}

/**
 * Autenticazione con credenziali (Email + Password o solo Password Master)
 */
export async function loginAction(
  emailOrPassword: string,
  optionalPassword?: string
): Promise<AuthResponse> {
  const targetEmail = (
    process.env.INITIAL_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    DEFAULT_ADMIN_CREDENTIALS.email
  ).toLowerCase();

  let inputPassword = '';
  let inputEmail = targetEmail;

  if (optionalPassword !== undefined && optionalPassword !== '') {
    inputEmail = emailOrPassword.trim().toLowerCase();
    inputPassword = optionalPassword;
  } else {
    inputPassword = emailOrPassword;
  }

  // Se l'email è stata fornita esplicitamente, controllala solo se diversa da quella di sistema
  if (optionalPassword !== undefined && optionalPassword !== '') {
    if (inputEmail !== targetEmail && inputEmail !== DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        message: 'Email o password non corretti.',
      };
    }
  }

  if (!verifyAdminPassword(inputPassword)) {
    return {
      success: false,
      message: 'Password o credenziali non corrette.',
    };
  }

  const token = await createSessionToken(inputEmail);
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
 * Accesso rapido 1-Click per ambienti Demo (Vercel)
 */
export async function loginDemoAction(): Promise<AuthResponse> {
  try {
    const targetEmail = (
      process.env.INITIAL_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      DEFAULT_ADMIN_CREDENTIALS.email
    ).toLowerCase();

    const token = await createSessionToken(targetEmail);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 giorni
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Errore durante l'accesso demo",
    };
  }
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
