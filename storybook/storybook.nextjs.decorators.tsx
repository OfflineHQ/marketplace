import { makeDecorator } from '@storybook/addons';
import { Decorator } from '@storybook/react';
import MockDate from 'mockdate';
import { NextIntlClientProvider } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';
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

export const I18nextStoryDecorator = makeDecorator({
  name: 'withI18next',
  parameterName: 'mockedDate',
  wrapper: (storyFn, context, { parameters: mockedDate }) => {
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
          now={staticDate || mockedDate}
        >
          {storyFn(context)}
        </NextIntlClientProvider>
      </Suspense>
    );
  },
});

export const mockDateDecorator = makeDecorator({
  name: 'withDate',
  parameterName: 'mockedDate',
  wrapper: (storyFn, context, { parameters: mockedDate }) => {
    MockDate.reset();
    if (mockedDate instanceof Date) {
      MockDate.set(mockedDate);
    }
    return storyFn(context);
  },
});
