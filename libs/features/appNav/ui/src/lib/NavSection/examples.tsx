import { type IconProps } from '@ui/icons';
import { NavigationMenu, NavigationMenuList } from '@ui/components';
import { NavSection, NavSectionProps } from './NavSection';

export const cartNavProps: NavSectionProps = {
  helperText: 'Go to your cart',
  href: '/cart',
};

export function NavSectionDemo(
  props: NavSectionProps,
  Icon: React.FC<IconProps>,
  text: string
) {
  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavSection {...props}>
            <Icon size="lg" />
            <div className="font-semibold">{text}</div>
          </NavSection>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
