import { defaultLocale, locales } from '@next/i18n';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: locales.slice(),
  defaultLocale,
});

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);
  res.headers.set('x-url', req.url);
  return res;
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|shopify|.*\\..*).*)'],
};
