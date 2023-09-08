import { Button, ButtonProps } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import {
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from '../dropdown-menu/DropdownMenuItems';

import { Language } from '@ui/icons';

export interface LanguageDropdownProps
  extends DropdownMenuItemsProps,
    ButtonProps {}

export function LanguageDropdown({ items, ...props }: LanguageDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={props.helperText as string}
          icon={<Language />}
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} className="w-10" />
    </DropdownMenu>
  );
}

export default LanguageDropdown;
