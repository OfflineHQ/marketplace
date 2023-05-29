import Logo from './Logo';
import { NavLink } from '../nav-link/NavLink';
import { NavigationMenu, NavigationMenuList, Separator } from '@ui/components';

export interface AppNavLayoutProps {
  children: React.ReactNode;
  profile: React.ReactNode;
  cart: React.ReactNode;
  pass: React.ReactNode;
}

export function AppNavLayout(props: AppNavLayoutProps) {
  const { children, profile, cart, pass } = props;

  return (
    <div className="flex h-full w-full flex-col-reverse md:flex-col">
      {/* Navigation for larger screens */}
      <div className="sticky top-0 z-50 hidden w-full md:flex">
        <NavigationMenu className="flex-1 justify-start">
          <NavigationMenuList>
            <NavLink href="/" className="min-w-[100px]">
              <Logo className="text-primary" />
            </NavLink>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu className="flex-1 justify-end">
          <NavigationMenuList className="mr-4 gap-6">
            {cart}
            {pass}
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu className="flex max-w-fit justify-end">
          <NavigationMenuList>
            <Separator orientation="vertical" className="my-1 h-12" />
            {profile}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex h-full w-full pb-16 md:pb-0">{children}</div>
      {/* Navigation for mobile screens */}
      <NavigationMenu className="fixed bottom-0 z-50 flex w-full md:hidden">
        <NavigationMenuList className="flex w-full">
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {cart}
          </div>
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {pass}
          </div>
          <div className="w-28 flex-1 whitespace-nowrap text-center">
            {profile}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
