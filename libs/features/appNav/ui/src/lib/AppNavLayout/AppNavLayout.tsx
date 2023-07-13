import Logo from './Logo';
import { NavLink } from '../nav-link/NavLink';
import { NavigationMenu, NavigationMenuList, Separator } from '@ui/components';

export interface AppNavLayoutProps {
  children: React.ReactNode;
  profileNav: React.ReactNode;
  cartNav: React.ReactNode;
  passNav: React.ReactNode;
}

export function AppNavLayout(props: AppNavLayoutProps) {
  const { children, profileNav, cartNav, passNav } = props;

  return (
    <div className="flex h-full w-full flex-col-reverse md:flex-col">
      {/* Navigation for larger screens */}
      <div className="sticky top-0 z-20 hidden w-full bg-background md:flex">
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
      </div>
      <div className="flex h-full w-full pb-16 md:pb-0">{children}</div>
      {/* Navigation for mobile screens */}
      <NavigationMenu
        data-testid="mobile-menu"
        className="fixed bottom-0 z-20 flex w-full bg-background md:hidden"
      >
        <NavigationMenuList className="flex w-full">
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {cartNav}
          </div>
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {passNav}
          </div>
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {profileNav}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
