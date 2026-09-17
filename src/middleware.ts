import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  const pathname = request.nextUrl.pathname;
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/tasks');
  const isLoginPage = pathname === '/login';

  // Se tenta di accedere all'area riservata senza sessione valida -> redirect al login
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se è già autenticato e visita /login -> redirect diretto ad /admin
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tasks/:path*', '/login'],
};
