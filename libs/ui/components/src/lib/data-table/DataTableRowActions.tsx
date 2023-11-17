'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { useState } from 'react';
import { Button, ButtonProps } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import {
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from '../dropdown-menu/DropdownMenuItems';

export interface DataTableRowActionsProps
  extends Omit<DropdownMenuItemsProps, 'setLoading'>,
    Pick<ButtonProps, 'isLoading' | 'helperText'> {}

export function DataTableRowActions({
  isLoading,
  helperText,
  ...menuProps
}: DataTableRowActionsProps) {
  const [loading, setLoading] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          isLoading={isLoading || loading}
          helperText={helperText}
          size="sm"
          icon={<DotsHorizontalIcon />}
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        />
      </DropdownMenuTrigger>

      <DropdownMenuItems {...menuProps} align="end" setLoading={setLoading} />
    </DropdownMenu>
  );
}
