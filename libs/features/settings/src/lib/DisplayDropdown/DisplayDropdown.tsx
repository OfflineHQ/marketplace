'use client';

import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
} from '@ui/components';

import { Dark, DarkLight, IconProps, Light } from '@ui/icons';
import { useTheme } from 'next-themes';

export interface DisplayDropdownProps
  extends DropdownMenuItemsProps,
    ButtonProps {}

export function DisplayDropdown({ items, ...props }: DisplayDropdownProps) {
  const { theme } = useTheme();
  const icons: { [index: string]: React.ReactElement<IconProps> } = {
    dark: <Dark />,
    light: <Light />,
    system: <DarkLight />,
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={props.helperText as string}
          icon={icons[theme as string] || icons.system}
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} className="w-auto" />
    </DropdownMenu>
  );
}

export default DisplayDropdown;
