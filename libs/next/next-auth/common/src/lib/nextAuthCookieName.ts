import { getNextAppURL } from '@shared/server';

export const nextAuthCookieName = (): string => {
  const useSecureCookies = getNextAppURL().startsWith('https://');
  const cookiePrefix = useSecureCookies ? '__Secure-' : '';
  return `${cookiePrefix}next-auth.session-token`;
};
