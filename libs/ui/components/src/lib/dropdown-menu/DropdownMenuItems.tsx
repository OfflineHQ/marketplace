import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { iconCVA } from '@ui/icons';
import { cn } from '@ui/shared';
import * as React from 'react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  extends Pick<DropdownMenuItemClientProps, 'setLoading'>,
    Pick<DropdownMenuContentProps, 'align'> {
  items: MenuItem[];
  className?: string;
  valueChanged?: (value: string) => void;
}

const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({
  items,
  className,
  setLoading,
  align,
}) => {
  const iconClasses = iconCVA({
    size: 'sm',
    marginRight: 'default',
  });

  return (
    <DropdownMenuContent className={cn('w-56', className)} align={align}>
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

          case 'sub-items':
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
          case 'sub-radios':
            return (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>
                  {icon && (
                    <icon.type
                      {...icon.props}
                      className={cn(iconClasses, icon.props.className)}
                    />
                  )}
                  <span>{item.text}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={item.value}>
                    {item.subItems?.map((subItem, subIndex) => (
                      <DropdownMenuRadioItem
                        key={subItem.value as string}
                        value={subItem.value as string}
                        disabled={subItem.disabled}
                        onSelect={subItem.action}
                      >
                        {subItem.text}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
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
