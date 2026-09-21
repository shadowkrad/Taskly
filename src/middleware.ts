import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  const pathname = request.nextUrl.pathname;
  const isAdmin = pathname === '/admin';
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/tasks');
  const isLoginPage = pathname === '/login';

  // Alias /admin -> redirect to /dashboard
  if (isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se tenta di accedere all'area riservata senza sessione valida -> redirect al login
  if (isDashboard && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se è già autenticato e visita /login -> redirect diretto a /dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/admin', '/admin/:path*', '/login'],
};
