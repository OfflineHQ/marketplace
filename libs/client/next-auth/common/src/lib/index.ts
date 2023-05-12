import { isProd, isServerSide } from '@utils';

export function getNextAppURL(): string {
  if (isProd()) {
    return isServerSide()
      ? (process.env.NEXTAUTH_URL as string)
      : (process.env.NEXT_PUBLIC_SITE_URL as string);
  } else {
    let vercelURL = '';
    if (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL)
      vercelURL = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return vercelURL || 'http://localhost:8888';
  }
}

export const nextAuthCookieName = (): string => {
  const useSecureCookies = getNextAppURL().startsWith('https://');
  const cookiePrefix = useSecureCookies ? '__Secure-' : '';
  return `${cookiePrefix}next-auth.session-token`;
};
