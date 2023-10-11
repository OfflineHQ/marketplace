import {
  LanguageDropdownClient,
  type LanguageDropdownClientProps,
} from './LanguageDropdownClient';

import {
  DisplayDropdownClient,
  type DisplayDropdownClientProps,
} from '../DisplayDropdown/DisplayDropdownClient';

import {
  CurrencyDropdownClient,
  type CurrencyDropdownClientProps,
} from './CurrencyDropdownClient';

export interface GlobalSettingsProps
  extends LanguageDropdownClientProps,
    DisplayDropdownClientProps,
    CurrencyDropdownClientProps {}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  languageSelectText,
  languageText,
  displaySelectText,
  displayText,
  currencySelectText,
  currencyText,
}) => {
  return (
    <div className="flex flex-col items-start gap-8">
      <LanguageDropdownClient
        languageSelectText={languageSelectText}
        languageText={languageText}
      />
      <DisplayDropdownClient
        displaySelectText={displaySelectText}
        displayText={displayText}
      />
      <CurrencyDropdownClient
        currencySelectText={currencySelectText}
        currencyText={currencyText}
      />
    </div>
  );
};
