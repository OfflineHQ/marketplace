import { Button, ButtonProps } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import {
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from '../dropdown-menu/DropdownMenuItems';

import { CurrencySettings } from '@ui/icons';

export interface CurrencyDropdownProps
  extends DropdownMenuItemsProps,
    ButtonProps {}

export function CurrencyDropdown({ items, ...props }: CurrencyDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={props.helperText as string}
          icon={<CurrencySettings />}
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} className="w-auto" />
    </DropdownMenu>
  );
}

export default CurrencyDropdown;
