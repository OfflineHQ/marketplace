'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '../button/Button';
import { DropdownMenu, DropdownMenuTrigger } from './DropdownMenu';

import {
  DropdownMenuItems,
  type DropdownMenuItemsProps,
} from './DropdownMenuItems';

import { MenuActions } from '@ui/icons';
import { cn } from '@ui/shared';
import { Ping, PingProps } from '../Ping/Ping';

export interface DropdownMenuActionsProps
  extends Omit<DropdownMenuItemsProps, 'setLoading'>,
    Pick<ButtonProps, 'isLoading' | 'helperText'> {
  buttonClassName?: string;
  ping?: PingProps;
}

export const DropdownMenuActions: React.FC<DropdownMenuActionsProps> = ({
  isLoading,
  helperText,
  buttonClassName,
  ping,
  className,
  ...menuProps
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <DropdownMenu>
      {/* This is the height of the button, forced to do that because of unreachable classes from Trigger with `relative inline block`, causing issue with the spinner */}
      <Ping {...ping}>
        <div className={cn('h-10 w-10', className)}>
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
      </Ping>
      <DropdownMenuItems {...menuProps} setLoading={setLoading} />
    </DropdownMenu>
  );
};
