import { getNextAppURL } from '@shared/server';
import { useNow as _useNow } from 'next-intl';
import { notFound } from 'next/navigation';
import { default as en } from './messages/en.json';
import { default as fr } from './messages/fr.json';

const messages = { en, fr } as const;
const locales = ['en', 'fr'] as const;
const defaultLocale = 'en';
export type Messages = (typeof messages)['en'];
export type Locale = (typeof locales)[number]; // 'en' | 'fr'

async function getMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export function getLocalizedUrls(url: string) {
  const urls: Record<Locale, string> = {
    en: `${getNextAppURL()}/en/${url}`,
    fr: `${getNextAppURL()}/fr/${url}`,
  };
  return urls;
}

export function useNow(props: _useNow.Props = {}) {
  if (isStorybook) return new Date();
  return _useNow(props);
}

export { defaultLocale, getMessages, locales, messages };
