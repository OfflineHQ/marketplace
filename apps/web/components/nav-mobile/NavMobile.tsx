import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@ui/components';

/* eslint-disable-next-line */

export interface NavMobileProps {
  menuSections: NavLinkProps[];
}

export function NavMobile({ menuSections }: NavMobileProps) {
  const sections = menuSections.map(({ children, href, ...rest }) => (
    <>
      <NavLink {...rest} key={href} href={href}>
        {children}
      </NavLink>
    </>
  ));
  return (
    <NavigationMenu orientation="vertical">
      <NavigationMenuList data-orientation="vertical" className="flex-col items-start">
        {sections}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavMobile;
