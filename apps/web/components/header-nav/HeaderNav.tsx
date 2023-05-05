import { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import { NavLink } from '../nav-link/NavLink';
import { type NavDesktopProps, NavDesktop } from '../nav-desktop/NavDesktop';
import { type NavMobileProps, NavMobile } from '../nav-mobile/NavMobile';
import { type ProfileNavProps, ProfileNav } from '../profile-nav/ProfileNav';
import { Menu, Close } from '@ui/icons';
import {
  Button,
  ButtonSkeleton,
  NavigationMenu,
  NavigationMenuList,
  Separator,
  AvatarSkeleton,
  TextSkeleton,
  AutoAnimate,
  DisplayDropdown,
  type DisplayDropdownProps,
  LanguageDropdown,
  type LanguageDropdownProps,
} from '@ui/components';

export interface HeaderNavProps
  extends NavDesktopProps,
    HeaderProfileProps,
    Omit<ProfileNavProps, 'user' | 'items'> {
  settings: HeaderSettingsProps;
  user: ProfileNavProps['user'] | undefined;
  loading?: boolean;
}

export interface HeaderSettingsProps {
  languageHelperText: string;
  languages: LanguageDropdownProps['items'];
  languageText: string;
  displays: DisplayDropdownProps['items'];
  displayText: string;
  displayHelperText: string;
  // locations: LanguageDropdownProps['items']; // TODO add locations (France/Germany/UK etc)
}

export interface HeaderProfileProps {
  user: HeaderNavProps['user'];
  signIn: () => void;
  userLoading: boolean;
  profileSections: ProfileNavProps['items'];
  loading?: HeaderNavProps['loading'];
}

function Profile({
  user,
  signIn,
  loading,
  userLoading,
  profileSections,
}: HeaderProfileProps) {
  const notSignedIn = !user && !userLoading;
  return (
    <AutoAnimate className="flex gap-2">
      {loading ? (
        <ButtonSkeleton className="m-1 w-20 md:m-2" />
      ) : notSignedIn ? (
        <Button onClick={signIn} className="m-1 md:m-2">
          Sign in
        </Button>
      ) : (
        <>
          <Separator orientation="vertical" className="my-1 h-10 md:h-12" />
          <AutoAnimate className="flex items-center">
            {userLoading || !user ? (
              <div className="flex items-center opacity-100">
                <AvatarSkeleton className="mx-5 mr-7 md:mr-2" />
                <TextSkeleton className="mr-5 hidden md:flex" />
              </div>
            ) : (
              <ProfileNav
                data-testid="profile-menu"
                user={user}
                items={profileSections}
              />
            )}
          </AutoAnimate>
        </>
      )}
    </AutoAnimate>
  );
}

export function HeaderNav(props: HeaderNavProps) {
  const { menuSections, settings, ...profileProps } = props;
  const [menuExpanded, setMenuExpanded] = useState(false);
  useEffect(() => {
    const html: HTMLElement = document.querySelector('html')!;
    // disable scroll of contents when menu mobile is expanded
    const activeClasses = ['fixed', 'h-full', 'inset-0'];
    if (html && menuExpanded) {
      activeClasses.forEach((activeClass) => html.classList.add(activeClass));
    } else if (html.classList.contains(activeClasses[0])) {
      activeClasses.forEach((activeClass) =>
        html.classList.remove(activeClass)
      );
    }
  }, [menuExpanded]);

  return (
    <AutoAnimate className={`relative ${menuExpanded ? 'fixed top-0' : ''}`}>
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
                  onClick={() => setMenuExpanded(!menuExpanded)}
                />
              </div>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavLink href="/">
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
          <div className="hidden gap-4 md:flex">
            <DisplayDropdown
              items={settings.displays}
              helperText={settings.displayHelperText}
            />
            <LanguageDropdown
              items={settings.languages}
              helperText={settings.languageHelperText}
            />
          </div>
          <Profile {...profileProps} />
        </div>
      </div>

      {/* mobile menu */}
      {menuExpanded && (
        <div className={`fixed bottom-0 top-24 z-10 block w-full lg:hidden`}>
          {/* <div className="flex flex-col gap-10"> */}
          <NavMobile
            menuSections={menuSections}
            className="flex h-full flex-col"
          >
            <div className="relative z-10 shrink-0">
              <div className="relative pb-3">
                <Separator
                  orientation="horizontal"
                  className="my-2 min-w-full"
                />
                <div className="flex justify-center">
                  <DisplayDropdown
                    items={settings.displays}
                    className="mx-2 px-3"
                  >
                    {settings.displayText}
                  </DisplayDropdown>
                  <LanguageDropdown
                    items={settings.languages}
                    className="mx-2 px-3"
                  >
                    {settings.languageText}
                  </LanguageDropdown>
                </div>
              </div>
            </div>
          </NavMobile>
          {/* {showSocialIcons && <SocialIcons />} */}
          {/* </div> */}
        </div>
      )}
    </AutoAnimate>
  );
}

export default HeaderNav;
