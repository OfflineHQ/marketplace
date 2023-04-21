import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  DisplayDropdown,
  type DisplayDropdownProps,
  LanguageDropdown,
  type LanguageDropdownProps,
} from '@ui/components';

export interface NavMobileProps {
  menuSections: NavLinkProps<string>[];
  children?: React.ReactNode;
  className?: string;
}

export function NavMobile({ menuSections, children, className }: NavMobileProps) {
  const sections = menuSections.map(({ children: section, href, ...rest }) => (
    <NavLink {...rest} href={href} key={`${href}-mobile`}>
      {section}
    </NavLink>
  ));
  return (
    <div className={className}>
      <NavigationMenu
        orientation="vertical"
        className="z-10 flex-1 items-start justify-start"
      >
        <NavigationMenuList data-orientation="vertical" className="flex-col items-start">
          {sections}
        </NavigationMenuList>
      </NavigationMenu>
      {children || null}
    </div>
  );
}

export default NavMobile;
