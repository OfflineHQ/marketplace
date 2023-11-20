import { NavigationMenu, NavigationMenuList, Separator } from '@ui/components';
import { NavLink } from '../nav-link/NavLink';
import Logo from './Logo';

export interface AppNavLayoutDesktopProps {
  cartNav: React.ReactNode;
  passNav: React.ReactNode;
  profileNav: React.ReactNode;
}

export const AppNavLayoutDesktop: React.FC<AppNavLayoutDesktopProps> = ({
  cartNav,
  passNav,
  profileNav,
}) => {
  return (
    <header className="absolute top-0 z-20 hidden w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      <NavigationMenu className="flex-1 justify-start">
        <NavigationMenuList>
          <NavLink href="/" className="mx-4 my-2 min-w-[100px] p-0">
            <Logo />
          </NavLink>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="flex-1 justify-end">
        <NavigationMenuList className="mr-4 gap-6">
          {cartNav}
          {passNav}
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="flex max-w-fit justify-end">
        <NavigationMenuList>
          <Separator orientation="vertical" className="my-1 h-12" />
          {profileNav}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
