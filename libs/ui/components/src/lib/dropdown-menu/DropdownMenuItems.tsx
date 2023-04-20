import * as React from 'react';
import {
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
} from './DropdownMenu';
import { cn } from '@ui/shared';

interface MenuItem {
  type: 'label' | 'separator' | 'item' | 'sub' | 'children';
  text?: string;
  children?: React.ReactNode;
  wrapper?: React.ReactElement;
  icon?: React.ReactElement;
  action?: () => void;
  shortcut?: string;
  disabled?: boolean;
  subItems?: MenuItem[];
  current?: boolean;
  className?: string;
}

interface DropdownMenuItemsProps {
  items: MenuItem[];
  className?: string;
}

const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({ items, className }) => {
  return (
    <DropdownMenuContent className={cn('w-56', className)}>
      {items.map((item, index) => {
        switch (item.type) {
          case 'separator':
            return <DropdownMenuSeparator key={index} />;

          case 'label':
            return (
              <DropdownMenuLabel key={index} className={item.className}>
                {item.text}
              </DropdownMenuLabel>
            );

          case 'children':
            return <div key={index}>{item.children}</div>;

          case 'item':
            return (
              <DropdownMenuGroup key={index}>
                <DropdownMenuItem
                  disabled={item.disabled}
                  onSelect={item.action}
                  wrapper={item.wrapper}
                  className={item.className}
                >
                  {item.icon &&
                    React.cloneElement(item.icon, { size: 'sm', marginRight: 'md' })}
                  <span>{item.text}</span>
                  {item.shortcut && (
                    <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            );

          case 'sub':
            return (
              <DropdownMenuGroup key={index}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {item.icon &&
                      React.cloneElement(item.icon, { size: 'sm', marginRight: 'md' })}
                    <span>{item.text}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItems items={item.subItems || []} />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            );

          default:
            return null;
        }
      })}
    </DropdownMenuContent>
  );
};
DropdownMenuItems.displayName = 'DropdownMenuItems';

export { DropdownMenuItems, type DropdownMenuItemsProps };
