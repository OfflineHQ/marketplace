import { defaultLocale, locales } from '@next/i18n';
import { nextAuthCookieName } from '@next/next-auth/common';
import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// TODO adapt this list to roles with restricted access to some routes + update tests
const authPages = [
  'user',
  'events',
  'events/*',
  // Add more restricted pages if needed
];

const intlMiddleware = createMiddleware({
  locales: locales.slice(),
  defaultLocale,
});

const authMiddleware = withAuth(
  (req) => {
    const isAuth = req.cookies.get(nextAuthCookieName());
    return isAuth
      ? intlMiddleware(req)
      : NextResponse.redirect(new URL('/', req.url));
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);

export default function middleware(req: NextRequest) {
  const restrictedPathnameRegex = RegExp(
    `^(/(${locales.join('|')})/)?(${authPages
      .map((page) => page.replace('*', '.*'))
      .join('|')})/?$`,
    'i',
  );
  const isAuthPage = restrictedPathnameRegex.test(req.nextUrl.pathname);
  if (isAuthPage) {
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
