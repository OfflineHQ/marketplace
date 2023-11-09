// SelectItems.tsx
import { iconCVA } from '@ui/icons';
import { cn } from '@ui/shared';
import * as React from 'react';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './Select';

export interface SelectItemProps {
  type: 'item' | 'group' | 'separator' | 'label' | 'children';
  text?: string;
  value?: string;
  items?: SelectItemProps[];
  className?: string;
  icon?: React.ReactElement;
  wrapper?: React.ReactElement;
  iconClasses?: string;
  disabled?: boolean;
}

export interface SelectItemsProps {
  items: SelectItemProps[];
  className?: string;
}

const SelectItems: React.FC<SelectItemsProps> = ({ items, className }) => {
  const iconClasses = iconCVA({
    size: 'sm',
    marginRight: 'default',
  });
  return (
    <SelectContent>
      {items.map(({ icon, ...item }, index) => {
        switch (item.type) {
          case 'item':
            return (
              <SelectItem
                key={index}
                disabled={item.disabled}
                wrapper={item.wrapper}
                value={item.value || index.toString()}
              >
                <div className="flex">
                  {icon && (
                    <icon.type
                      {...icon.props}
                      className={cn(iconClasses, icon.props.className)}
                    />
                  )}
                  <span>{item.text}</span>
                </div>
              </SelectItem>
            );
          case 'group':
            return (
              <SelectGroup key={index}>
                {item.items?.map(
                  ({ icon: groupIcon, ...groupItem }, groupIndex) => {
                    // eslint-disable-next-line sonarjs/no-nested-switch
                    switch (groupItem.type) {
                      case 'label':
                        return (
                          <SelectLabel
                            key={groupIndex}
                            className={groupItem.className}
                          >
                            {groupItem.text}
                          </SelectLabel>
                        );
                      case 'item':
                        return (
                          <SelectItem
                            key={groupIndex}
                            disabled={groupItem.disabled}
                            wrapper={groupItem.wrapper}
                            value={groupItem.value || groupIndex.toString()}
                          >
                            <div className="flex">
                              {groupIcon && (
                                <groupIcon.type
                                  {...groupIcon.props}
                                  className={cn(
                                    iconClasses,
                                    groupIcon.props.className,
                                  )}
                                />
                              )}
                              {groupItem.text}
                            </div>
                          </SelectItem>
                        );
                      default:
                        return null;
                    }
                  },
                )}
              </SelectGroup>
            );
          case 'separator':
            return <SelectSeparator key={index} />;
          default:
            return null;
        }
      })}
    </SelectContent>
  );
};

SelectItems.displayName = 'SelectItems';

export { SelectItems };
