import type { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { NavLink } from '../nav-link/NavLink';
import { type NavDesktopProps, NavDesktop } from '../nav-desktop/NavDesktop';
import { type NavMobileProps, NavMobile } from '../nav-mobile/NavMobile';
import { type ProfileNavProps, ProfileNav } from '../profile-nav/ProfileNav';
import { Menu, Close } from '@ui/icons';
import { Button, NavigationMenu, NavigationMenuList, Separator } from '@ui/components';

export interface HeaderNavProps
  extends NavDesktopProps,
    Omit<ProfileNavProps, 'items' | 'session'> {
  session: Session | null | undefined;
  profileSections: ProfileNavProps['items'];
  signIn: () => void;
}

export function HeaderNav(props: HeaderNavProps) {
  const { menuSections, signIn, session, profileSections } = props;
  const [menuExpanded, setMenuExpanded] = useState(false);
  useEffect(() => {
    const html: HTMLElement = document.querySelector('html')!;
    // disable scroll of contents when menu mobile is expanded
    const activeClasses = ['fixed', 'h-full', 'inset-0'];
    if (html && menuExpanded) {
      activeClasses.forEach((activeClass) => html.classList.add(activeClass));
    } else if (html.classList.contains(activeClasses[0])) {
      activeClasses.forEach((activeClass) => html.classList.remove(activeClass));
    }
  }, [menuExpanded]);
  return (
    <div className={`relative ${menuExpanded ? 'fixed top-0' : ''}`}>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="block lg:hidden">
                <Button
                  className="ml-2"
                  icon={menuExpanded ? Close : Menu}
                  variant="ghost"
                  data-testid="hamburger-menu"
                  size="md"
                  onClick={() => setMenuExpanded(!menuExpanded)}
                />
              </div>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavLink href="/" className="min-w-[100px]">
                    <div className="h-full w-full">
                      <Logo />
                    </div>
                  </NavLink>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="hidden items-center justify-center gap-4 lg:flex">
            <NavDesktop menuSections={menuSections} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          {/* {showSocialIcons && (
            <div className="hidden lg:block">
              <SocialIcons />
            </div>
          )} */}
          <div className="flex gap-2">
            {!session ? (
              <Button onClick={signIn} className="m-1 md:m-2">
                Sign in
              </Button>
            ) : (
              <>
                <Separator orientation="vertical" className="my-1 h-10 md:h-12" />
                <ProfileNav
                  data-testid="profile-menu"
                  session={session}
                  items={profileSections}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {menuExpanded && (
        <div
          className={`fixed bottom-0 top-24 z-10 block overflow-scroll pb-20 lg:hidden`}
        >
          <div className="flex flex-col gap-10">
            <NavMobile menuSections={menuSections} />
            {/* {showSocialIcons && <SocialIcons />} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderNav;
