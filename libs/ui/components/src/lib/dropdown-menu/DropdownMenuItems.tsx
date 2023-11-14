import { iconCVA } from '@ui/icons';
import { cn } from '@ui/shared';
import * as React from 'react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './DropdownMenu';
import {
  DropdownMenuItemClient,
  MenuItem,
  type DropdownMenuItemClientProps,
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
            return (
              <div key={index} className={item.className}>
                {item.children}
              </div>
            );

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
                      {item.subItems?.map((subItem, subIndex) =>
                        subItem.type !== 'children' ? (
                          <DropdownMenuItemClient
                            key={subIndex}
                            icon={subItem.icon}
                            item={subItem}
                            setLoading={setLoading}
                            iconClasses={iconClasses}
                          />
                        ) : (
                          <div key={subIndex} className={subItem.className}>
                            {subItem.children}
                          </div>
                        ),
                      )}
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
