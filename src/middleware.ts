import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static resources, images, system routes, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie (checking both collateraliq_auth & collateral_iq_auth)
  const authSession =
    request.cookies.get('collateraliq_auth')?.value ||
    request.cookies.get('collateral_iq_auth')?.value;

  // 3. Unauthenticated visitor trying to access protected route -> redirect to /login
  if (!authSession && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
