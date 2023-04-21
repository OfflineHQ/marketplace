import '../styles/globals.css';
import { Preview, Decorator } from '@storybook/react';
import { useEffect, useState, Suspense } from 'react';
import { parameters } from '../../../storybook.preview.base';
import { I18nextProvider } from 'react-i18next';
import { i18next } from '../app/i18n/client';

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

// When The language changes, set the document direction
i18next.on('languageChanged', (locale) => {
  const direction = i18next.dir(locale);
  document.dir = direction;
});

// Wrap your stories in the I18nextProvider component
const I18nextStoryDecorator: Decorator = (Story, context) => {
  const { locale } = context.globals;

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  return (
    // here catches the suspense from components not yet ready (still loading translations)
    // alternative set useSuspense false on i18next.options.react when initializing i18next
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18next}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters,
  decorators: [I18nextStoryDecorator, DarkModeDecorator],
};
export default preview;
