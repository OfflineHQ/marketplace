import { useFormatter, useTimeZone, useTranslations } from 'next-intl';
export { getRequestConfig } from 'next-intl/server';

export async function getTranslations({ locale, namespace }) {
  return Promise.resolve(useTranslations(namespace));
}

export async function getTimeZone() {
  return Promise.resolve(useTimeZone());
}

export async function getFormatter({ locale }) {
  return Promise.resolve(useFormatter());
}
