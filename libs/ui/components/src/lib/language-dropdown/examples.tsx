import { LanguageDropdownProps, LanguageDropdown } from './LanguageDropdown';
import { Check } from '@ui/icons';

export const languageItems: LanguageDropdownProps['items'] = [
  {
    type: 'item',
    text: 'English',
    icon: <Check />,
    disabled: true,
  },
  {
    type: 'item',
    text: 'Français',
  },
  {
    type: 'item',
    text: 'Español',
  },
];

export function LanguageDropdownExample(props: LanguageDropdownProps) {
  return <LanguageDropdown {...props} />;
}
