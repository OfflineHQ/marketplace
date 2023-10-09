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
  currencySelectText: {
    eur: 'EUR',
    usd: 'USD',
  },
  currencyText: 'Select your default currency',
};

export const GlobalSettingsExample = (props: GlobalSettingsProps) => {
  return <GlobalSettings {...props} />;
};
