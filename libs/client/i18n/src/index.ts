import { default as fr } from './messages/fr.json';
import { default as en } from './messages/en.json';

const messages = { fr, en } as const;
const locales = ['en', 'fr'] as const;
const defaultLocale = 'en';
export type Messages = (typeof messages)['en'];
export type Locale = (typeof locales)[number]; // 'en' | 'fr'

export { messages, locales, defaultLocale };
