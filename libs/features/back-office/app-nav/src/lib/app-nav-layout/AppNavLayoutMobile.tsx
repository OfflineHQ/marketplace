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
      className="fixed bottom-0 z-20 flex w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
    >
      <NavigationMenuList className="grid h-16 grid-cols-7">
        <div className="col-span-5 ml-2 flex-col items-center">{menuNav}</div>
        <div className="col-span-2 flex items-center pl-2">{profileNav}</div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
