'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { Button, type ButtonProps } from '../button/Button';

import {
  DropdownMenuItems,
  type DropdownMenuItemsProps,
} from './DropdownMenuItems';

import { MenuActions } from '@ui/icons';

export interface DropdownMenuActionsProps
  extends Omit<DropdownMenuItemsProps, 'setLoading'>,
    Pick<ButtonProps, 'isLoading' | 'helperText'> {
  buttonClassName?: string;
}

export const DropdownMenuActions: React.FC<DropdownMenuActionsProps> = ({
  isLoading,
  helperText,
  buttonClassName,
  ...menuProps
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <DropdownMenu>
      {/* This is the height of the button, forced to do that because of unreachable classes from Trigger with `relative inline block`, causing issue with the spinner */}
      <div className="h-10">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={buttonClassName}
            icon={<MenuActions />}
            isLoading={isLoading || loading}
            helperText={helperText}
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuItems {...menuProps} setLoading={setLoading} />
    </DropdownMenu>
  );
};
