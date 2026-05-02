import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('grind_user');
  const { pathname } = request.nextUrl;

  // If user is logged in and visits the landing page, redirect to dashboard
  if (userCookie && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is NOT logged in and tries to access protected routes, redirect to landing
  if (!userCookie && (pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/history') || pathname.startsWith('/insights') || pathname.startsWith('/heatmap'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/history/:path*', '/insights/:path*', '/heatmap/:path*'],
};
