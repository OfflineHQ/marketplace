'use client';
import React, { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { HeaderNav } from '@web/components/header-nav/HeaderNav';
import type { HeaderSettingsProps } from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';
import { useAuthContext } from '@client/auth';

const Header = () => {
  const { safeUser, login, logout, safeAuth, provider } = useAuthContext();
  const [language, setLanguage] = useState<'en' | 'fr'>();
  const { setTheme, theme } = useTheme();

  const displays = useMemo(
    () => [
      {
        type: 'item',
        text: 'Light',
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

  const languages = useMemo(
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

  const languageText = 'Language';
  const languageHelperText = 'Select your language';
  const displayText = 'Display mode';
  const displayHelperText = 'Select a display mode';

  return (
    <HeaderNav
      profileSections={[]}
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
