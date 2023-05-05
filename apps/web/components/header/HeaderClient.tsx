'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import {
  HeaderNav,
  type HeaderSettingsProps,
  type HeaderProfileProps,
} from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check, LifeBuoy, LogOut } from '@ui/icons';
import { useToast } from '@ui/components';
import { useAuthContext } from '@client/auth';

const Header = () => {
  const { safeUser, login, logout, safeAuth, provider } = useAuthContext();
  const [language, setLanguage] = useState<'en' | 'fr'>();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  const t = useTranslations('Header');

  const displays: HeaderSettingsProps['displays'] = useMemo(
    () => [
      {
        type: 'item',
        text: t('display-options.light'),
        icon: <Light />,
        action: () => setTheme('light'),
        disabled: theme === 'light',
      },
      {
        type: 'item',
        text: 'Dark',
        action: () => {
          console.log('set dark');
          setTheme('dark');
        },
        icon: <Dark />,
        disabled: theme === 'dark',
      },
      {
        type: 'item',
        text: 'Automatic',
        action: () => setTheme('auto'),
        icon: <DarkLight />,
        disabled: theme === 'auto',
      },
    ],
    [theme, setTheme]
  );

  const languages: HeaderSettingsProps['languages'] = useMemo(
    () => [
      {
        type: 'item',
        text: 'English',
        icon: <Check />,
        disabled: true,
      },
      {
        type: 'item',
        text: 'Français',
      },
    ],
    []
  );

  const signOutUserAction = useCallback(async () => {
    await logout();
    toast({
      title: 'You have been signed out',
      description: 'See you soon 👋 !',
    });
  }, [logout, toast]);

  const profileSections: HeaderProfileProps['profileSections'] = useMemo(
    () =>
      !safeUser
        ? []
        : [
            { type: 'label', text: 'My Account', className: 'pt-2 pb-0' },
            {
              type: 'children',
              children: (
                <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
                  {safeUser.name || safeUser.eoa}
                </div>
              ),
            },
            { type: 'separator' },
            {
              type: 'item',
              icon: <LifeBuoy />,
              className: 'cursor-pointer',
              text: 'Support',
              action: () =>
                toast({
                  title: 'Coming soon',
                  description: 'This feature is not available yet',
                }),
            },
            { type: 'separator' },
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: 'Sign out',
            },
          ],
    [safeUser, signOutUserAction, toast]
  );

  const languageText = 'Language';
  const languageHelperText = 'Select your language';
  const displayText = 'Display mode';
  const displayHelperText = 'Select a display mode';

  return (
    <HeaderNav
      profileSections={profileSections}
      menuSections={[]}
      signIn={login}
      loading={!safeAuth}
      user={safeUser}
      userLoading={!!provider && !safeUser} // mean web3Auth is connected but waiting for cookie and safe user info
      settings={{
        languages,
        languageText,
        languageHelperText,
        displays,
        displayText,
        displayHelperText,
      }}
    />
  );
};

export default React.memo(Header);
