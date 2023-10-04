import { createSharedPathnamesNavigation } from 'next-intl/navigation';

// avoid import from @next/i18n otherwise break storybook
const locales = ['en', 'fr'];

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
