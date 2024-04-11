import { defaultLocale, locales } from '@next/i18n';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: locales.slice(),
  defaultLocale,
});

export default function middleware(req: NextRequest) {
  const next = NextResponse.next(intlMiddleware(req));
  next.headers.set('x-url', req.url);
  return next;
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
