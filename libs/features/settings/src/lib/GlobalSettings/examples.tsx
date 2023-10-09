import { GlobalSettings, type GlobalSettingsProps } from './GlobalSettings';

export const globalSettingsProps = {
  languageSelectText: {
    en: 'English',
    fr: 'Français',
  },
  languageText: 'Select your language',
  displaySelectText: {
    light: 'Light',
    dark: 'Dark',
    system: 'Automatic',
  },
  displayText: 'Display mode',
  currencySelectText: 'Select your default currency',
  currencyText: {
    eur: 'EUR',
    usd: 'USD',
  },
};

export const GlobalSettingsExample = (props: GlobalSettingsProps) => {
  return <GlobalSettings {...props} />;
};
