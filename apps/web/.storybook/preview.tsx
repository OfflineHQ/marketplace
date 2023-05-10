import '../styles/globals.css';
import { Preview, Decorator } from '@storybook/react';
import { useEffect, useState, Suspense } from 'react';
import { parameters } from '../../../storybook.preview.base';
import { NextIntlClientProvider } from 'next-intl';
import { messages, locales, defaultLocale } from '@client/i18n';

export const DarkModeDecorator: Decorator = (Story: any, context: any = {}) => {
  const [dark, setDark] = useState(false);
  const { isDark } = context.parameters.darkMode;

  useEffect(() => {
    setDark(isDark);
    document.documentElement.classList.add('light');
    if (isDark) {
      document.documentElement.classList.replace('light', 'dark');
    }
  }, [dark, isDark]);

  return dark ? <Story key={dark} /> : <Story />;
};

// Create a global variable called locale in storybook
// and add a dropdown in the toolbar to change your locale
export const globalTypes = {
  locale: {
    defaultValue: 'en',
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Francais' },
      ],
      showName: true,
    },
  },
};

const I18nextStoryDecorator: Decorator = (Story, context) => {
  let { locale } = context.globals;
  locale = locale && locales.includes[locale] ? locale : defaultLocale;
  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <Story />
    </NextIntlClientProvider>
  );
};

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters,
  decorators: [I18nextStoryDecorator, DarkModeDecorator],
};
export default preview;
