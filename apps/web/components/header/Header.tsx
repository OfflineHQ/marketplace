'use client';
// import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react';
import { HeaderNav } from '@web/components/header-nav/HeaderNav';
import type { HeaderSettingsProps } from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check } from '@ui/icons';
import { useAuthContext } from '@web/lib/authProvider';

export default function Header() {
  const { safeUser, login, logout, safeAuth, provider } = useAuthContext();

  const displayItems: HeaderSettingsProps['displays'] = [
    {
      type: 'item',
      text: 'Light',
      icon: <Light />,
      disabled: true,
    },
    {
      type: 'item',
      text: 'Dark',
      icon: <Dark />,
    },
    {
      type: 'item',
      text: 'Automatic',
      icon: <DarkLight />,
    },
  ];

  const languages: HeaderSettingsProps['languages'] = [
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
  ];

  const languageText = 'Language';
  const languageHelperText = 'Select your language';
  const displayText = 'Display mode';
  const displayHelperText = 'Select a display mode';

  // const { data: session } = useSession();

  return (
    // <SafeThemeProvider mode="dark">
    //   {(safeTheme) => (
    <HeaderNav
      profileSections={[]}
      menuSections={[]}
      signIn={login}
      loading={!safeAuth}
      session={safeUser}
      sessionLoading={!!provider && !safeUser} // mean web3Auth is connected but waiting for cookie and safe user info
      settings={{
        languages,
        languageText,
        languageHelperText,
        displays: displayItems,
        displayText,
        displayHelperText,
      }}
    />
    //   )}
    // </SafeThemeProvider>
  );
}
