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
import { iconCVA } from '@ui/icons';
import {
  DropdownMenuItemClient,
  type DropdownMenuItemClientProps,
  MenuItem,
} from './DropdownMenuItemClient';

interface DropdownMenuItemsProps
  extends Pick<DropdownMenuItemClientProps, 'setLoading'> {
  items: MenuItem[];
  className?: string;
}

const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({
  items,
  className,
  setLoading,
}) => {
  const iconClasses = iconCVA({
    size: 'sm',
    marginRight: 'default',
  });

  return (
    <DropdownMenuContent className={cn('w-56', className)}>
      {items.map(({ icon, ...item }, index) => {
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
                <DropdownMenuItemClient
                  icon={icon}
                  item={item}
                  setLoading={setLoading}
                  iconClasses={iconClasses}
                />
              </DropdownMenuGroup>
            );

          case 'sub':
            return (
              <DropdownMenuGroup key={index}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {icon && (
                      <icon.type
                        {...icon.props}
                        className={cn(iconClasses, icon.props.className)}
                      />
                    )}
                    <span>{item.text}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItems
                        items={item.subItems || []}
                        setLoading={setLoading}
                      />
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
