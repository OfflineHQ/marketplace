import { useFormatter, useTimeZone, useTranslations } from 'next-intl';

import { messages } from '@next/i18n';

export async function getRequestConfig({ locale }) {
  return {
    messages: messages[locale],
    now: new Date('2023-06-05T00:00:00Z'),
  };
}

export async function getTranslations({ locale, namespace }) {
  return Promise.resolve(useTranslations(namespace));
}

export async function getTimeZone() {
  return Promise.resolve(useTimeZone());
}

export async function getFormatter({ locale }) {
  return Promise.resolve(useFormatter());
}
