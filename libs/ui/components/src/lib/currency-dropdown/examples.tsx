import { Check } from '@ui/icons';
import { CurrencyDropdown, CurrencyDropdownProps } from './CurrencyDropdown';

export const currencyItems: CurrencyDropdownProps['items'] = [
  {
    type: 'item',
    text: 'EUR',
    icon: <Check />,
    disabled: true,
  },
  {
    type: 'item',
    text: 'USD',
  },
];

export function CurrencyDropdownExample(props: CurrencyDropdownProps) {
  return (
    <div className="flex">
      <CurrencyDropdown {...props} />
    </div>
  );
}
