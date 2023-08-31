import { getRequestConfig } from 'next-intl/server';
// See if with a lot of languages we should use a different approach like dynamic imports
import { messages } from '@next/i18n';

export default getRequestConfig(async ({ locale }) => ({
  messages: messages[locale],
  // This is the default, a single date instance will be used
  // by all Server Components to ensure consistency
  now: new Date(),
  // The time zone can either be statically defined, read from the
  // user profile if you store such a setting, or based on dynamic
  // request information like the locale or headers.
  // timeZone: 'Europe/Paris',
}));
