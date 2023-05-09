import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'fr'];
const authPages = [
  '/dummy', // /user // not working currently
  // Add more restricted pages if needed
];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
});

const authMiddleware = withAuth(
  (req) => {
    const { token } = req.nextauth;
    console.log('token', token);
    const isAuth = !!token;
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
  }
);

export default function middleware(req: NextRequest) {
  const restrictedPathnameRegex = RegExp(
    `^(/(${locales.join('|')})/)?(${authPages.join('|')})/?$`,
    'i'
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
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
