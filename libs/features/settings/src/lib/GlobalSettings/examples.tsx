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
    auto: 'Automatic',
  },
  displayText: 'Display mode',
};

export const GlobalSettingsExample = (props: GlobalSettingsProps) => {
  return <GlobalSettings {...props} />;
};
