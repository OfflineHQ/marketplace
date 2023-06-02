import {
  LanguageDropdownClient,
  type LanguageDropdownClientProps,
} from './LanguageDropdownClient';

import {
  DisplayDropdownClient,
  type DisplayDropdownClientProps,
} from './DisplayDropdownClient';

export interface GlobalSettingsProps
  extends LanguageDropdownClientProps,
    DisplayDropdownClientProps {}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  languageSelectText,
  languageText,
  displaySelectText,
  displayText,
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
    </div>
  );
};
