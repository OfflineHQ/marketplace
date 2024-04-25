import { getNextAppURL } from '@shared/server';
import IntlMessageFormat, {
  Formats,
  Formatters,
  PrimitiveType,
} from 'intl-messageformat';
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
    en: `${getNextAppURL()}en/${url}`,
    fr: `${getNextAppURL()}fr/${url}`,
  };
  return urls;
}

interface StringMap {
  [key: string]: PrimitiveType | React.ReactElement | FormatXMLElementFn;
}

interface FormatXMLElementFn {
  (parts: React.ReactElement[]): React.ReactElement;
}

interface Options {
  formatters?: Formatters;
  ignoreTag?: boolean;
}

function interpolateString(
  str: string,
  locale: Locale,
  values?: StringMap | null,
  formats?: Formats,
  opts?: Options,
) {
  try {
    const messageFormat = new IntlMessageFormat(str, locale, formats, opts);
    return messageFormat.format<string>(values);
  } catch (error) {
    console.error('Error interpolating string:', error);
    return str;
  }
}

export { defaultLocale, getMessages, interpolateString, locales, messages };
