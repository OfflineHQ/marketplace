import { getRequestConfig } from 'next-intl/server';
// See if with a lot of languages we should use a different approach like dynamic imports
import { messages } from '@client/i18n';

export default getRequestConfig(async ({ locale }) => ({
  messages: messages[locale],
}));
