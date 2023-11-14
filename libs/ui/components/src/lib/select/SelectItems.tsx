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
  children?: React.ReactNode;
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

  const renderSelectItem = (itemProps: SelectItemProps, itemIndex: number) => {
    const { icon: itemIcon, ...item } = itemProps;
    const content = (
      <div className="flex items-center">
        {itemIcon && (
          <itemIcon.type
            {...itemIcon.props}
            className={cn(iconClasses, itemIcon.props.className, 'ml-2')}
          />
        )}
        <span>{item.text}</span>
      </div>
    );

    return (
      <SelectItem
        key={itemIndex}
        disabled={item.disabled}
        value={item.value || itemIndex.toString()}
      >
        {item.wrapper ? React.cloneElement(item.wrapper, {}, content) : content}
      </SelectItem>
    );
  };

  return (
    <SelectContent>
      {items.map(({ icon, ...item }, index) => {
        switch (item.type) {
          case 'item':
            return renderSelectItem(item, index);
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
                        return renderSelectItem(groupItem, groupIndex);
                      case 'children':
                        return (
                          <div key={groupIndex} className={groupItem.className}>
                            {groupItem.children}
                          </div>
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
          case 'children':
            return (
              <div key={index} className={item.className}>
                {item.children}
              </div>
            );
          default:
            return null;
        }
      })}
    </SelectContent>
  );
};

SelectItems.displayName = 'SelectItems';

export { SelectItems };
