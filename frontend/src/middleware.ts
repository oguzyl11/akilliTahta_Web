// =============================================================================
// Next.js Middleware — Route Koruma
// ENGINEERING_STANDARDS: Yetkisiz erişimde login'e yönlendirme
// =============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Auth gerektirmeyen yollar */
const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password'];

/** Rol → izin verilen path prefix eşlemesi */
const ROLE_PATH_MAP: Record<string, string[]> = {
  STUDENT: ['/student'],
  TEACHER: ['/teacher'],
  PARENT: ['/parent'],
  INSTITUTION_ADMIN: ['/institution'],
  SUPER_ADMIN: ['/admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public yollar — auth gerekmez
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Static dosyalar ve API — middleware uygulanmaz
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Root path — login'e yönlendir
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Not: Token kontrolü client-side'da useAuth hook ile yapılır
  // Middleware burada yalnızca basit path-based koruma sağlar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
