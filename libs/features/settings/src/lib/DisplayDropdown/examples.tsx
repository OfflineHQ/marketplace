import { DisplayDropdownProps, DisplayDropdown } from './DisplayDropdown';

import { Dark, Light, DarkLight } from '@ui/icons';

export const displayItems: DisplayDropdownProps['items'] = [
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

export const displayItemsDark: DisplayDropdownProps['items'] = [
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

export function DisplayDropdownExample(props: DisplayDropdownProps) {
  return (
    <div className="flex">
      <DisplayDropdown {...props} />{' '}
    </div>
  );
}
