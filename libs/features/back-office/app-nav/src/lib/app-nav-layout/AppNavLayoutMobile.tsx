import { NavigationMenu, NavigationMenuList } from '@ui/components';

export interface AppNavLayoutMobileProps {
  menuNav: React.ReactNode;
  profileNav: React.ReactNode;
}

export const AppNavLayoutMobile: React.FC<AppNavLayoutMobileProps> = ({
  profileNav,
  menuNav,
}) => {
  return (
    <NavigationMenu
      data-testid="mobile-menu"
      className="fixed bottom-0 z-20 w-full border-t bg-background md:hidden"
    >
      <NavigationMenuList className="grid grid-cols-7">
        <div className="col-span-5 ml-2">{menuNav}</div>
        <div className="col-span-2">{profileNav}</div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
