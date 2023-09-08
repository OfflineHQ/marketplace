'use client';

import { Button, ButtonProps } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import {
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from '../dropdown-menu/DropdownMenuItems';

import { Dark, Light } from '@ui/icons';
import { useDarkMode } from '@ui/hooks';

export interface DisplayDropdownProps
  extends DropdownMenuItemsProps,
    ButtonProps {}

export function DisplayDropdown({ items, ...props }: DisplayDropdownProps) {
  const isDark = useDarkMode();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={props.helperText as string}
          icon={isDark ? <Dark /> : <Light />}
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} className="w-10" />
    </DropdownMenu>
  );
}

export default DisplayDropdown;
