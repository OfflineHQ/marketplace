import { HeaderNavProps, HeaderNav, type HeaderSettingsProps } from './HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';

const displayItems: HeaderSettingsProps['displays'] = [
  {
    type: 'item',
    text: 'Light',
    icon: <Light />,
    disabled: true,
  },
  {
    type: 'item',
    text: 'Dark',
    icon: <Dark />,
  },
  {
    type: 'item',
    text: 'Automatic',
    icon: <DarkLight />,
  },
];

const displayItemsDark: HeaderSettingsProps['displays'] = [
  {
    type: 'item',
    text: 'Light',
    icon: <Light />,
  },
  {
    type: 'item',
    text: 'Dark',
    icon: <Dark />,
    disabled: true,
  },
  {
    type: 'item',
    text: 'Automatic',
    icon: <DarkLight />,
  },
];

const languages: HeaderSettingsProps['languages'] = [
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
];

const languageText = 'Language';
const languageHelperText = 'Select your language';
const displayText = 'Display mode';
const displayHelperText = 'Select a display mode';

function HeaderNavExample(props: HeaderNavProps) {
  return <HeaderNav {...props} />;
}

export {
  displayItems,
  displayItemsDark,
  languages,
  languageText,
  languageHelperText,
  displayText,
  displayHelperText,
  HeaderNavExample,
};
