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

export { defaultLocale, getMessages, locales, messages };
