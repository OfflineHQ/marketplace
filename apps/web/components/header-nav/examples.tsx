import { HeaderNavProps, HeaderNav, type HeaderSettingsProps } from './HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';

export const displayItems: HeaderSettingsProps['displays'] = [
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

export const displayItemsDark: HeaderSettingsProps['displays'] = [
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

export const languages: HeaderSettingsProps['languages'] = [
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

export function HeaderNavExample(props: HeaderNavProps) {
  return <HeaderNav {...props} />;
}
