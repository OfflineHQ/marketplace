import { GlobalSettings, type GlobalSettingsProps } from './GlobalSettings';
import { NextIntlClientProvider } from 'next-intl';
import { messages } from '@client/i18n';

export const globalSettingsProps = {
  languageSelectText: {
    en: 'English',
    fr: 'Français',
  },
  languageText: 'Select your language',
  displaySelectText: {
    light: 'Light',
    dark: 'Dark',
    auto: 'Automatic',
  },
  displayText: 'Display mode',
};

export const GlobalSettingsExample = (props: GlobalSettingsProps) => {
  return (
    <NextIntlClientProvider locale={'en'} messages={messages['en']}>
      <GlobalSettings {...props} />
    </NextIntlClientProvider>
  );
};
