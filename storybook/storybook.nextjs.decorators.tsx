import { Decorator } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import React, { Suspense, useEffect, useState } from 'react';
import messagesEn from '../libs/next/i18n/src/messages/en.json';
import messagesfr from '../libs/next/i18n/src/messages/fr.json';

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

export const localStorageResetDecorator: Decorator = (Story) => {
  window.localStorage.clear();
  return <Story />;
};

// mocked date to always get the same result in tests
const staticDate = new Date('2023-06-05T00:00:00Z');

export const I18nextStoryDecorator: Decorator = (Story, context) => {
  const { locale: selectedLocale } = context.globals;
  const locale = selectedLocale || 'en';
  const messages = {
    en: messagesEn,
    fr: messagesfr,
  };
  return (
    <Suspense>
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        now={staticDate}
      >
        {Story(context)}
      </NextIntlClientProvider>
    </Suspense>
  );
};
