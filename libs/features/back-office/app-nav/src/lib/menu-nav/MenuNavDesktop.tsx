import { NavLink } from '@features/app-nav';
import { SelectItemsProps } from '@ui/components';
import { iconCVA } from '@ui/icons';
import { cn } from '@ui/shared';

export type MenuNavDesktopProps = SelectItemsProps;

export const MenuNavDesktop: React.FC<MenuNavDesktopProps> = ({
  items,
  ...props
}) => {
  if (items.length === 0) return null;
  const iconClasses = iconCVA({
    size: 'default',
    marginRight: 'default',
  });
  return (
    items.length > 0 &&
    items.map(({ type, value, icon, text, ...props }) => {
      return type === 'item' ? (
        <NavLink href={value as string} key={value}>
          <>
            {icon && (
              <icon.type
                {...icon.props}
                className={cn(iconClasses, icon.props.className)}
              />
            )}
            <span>{text}</span>
          </>
        </NavLink>
      ) : null;
    })
  );
};
