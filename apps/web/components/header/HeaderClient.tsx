'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import {
  HeaderNav,
  type HeaderSettingsProps,
  type HeaderProfileProps,
} from '@web/components/header-nav/HeaderNav';
import { Dark, Light, DarkLight, Check, LifeBuoy, LogOut } from '@ui/icons';
import { useToast } from '@ui/components';
import { useAuthContext } from '@client/auth';
import { usePathname } from 'next-intl/client';
import { useSearchParams, useRouter } from 'next/navigation';

const Header = () => {
  const { safeUser, login, logout, safeAuth, provider } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  const t = useTranslations('Header');
  const router = useRouter();
  const locale = useLocale();

  // const { pathname, asPath, query } = router;
  const pathname = usePathname() as string;
  const searchParams = useSearchParams();
  const getCurrentUrl = useCallback(() => {
    let url = pathname;
    if (searchParams?.toString()) url += `?${searchParams.toString()}`;
    return url;
  }, [pathname, searchParams]);

  const [currentUrl, setCurrentUrl] = useState<string>(getCurrentUrl());

  useEffect(() => {
    setCurrentUrl(getCurrentUrl());
  }, [pathname, searchParams]);

  const changeLocale = (newLocale: string) => {
    const url =
      currentUrl && currentUrl !== '/' ? newLocale + currentUrl : newLocale;
    router.push(url);
  };

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
        text: t('display-options.dark'),
        action: () => {
          console.log('set dark');
          setTheme('dark');
        },
        icon: <Dark />,
        disabled: theme === 'dark',
      },
      {
        type: 'item',
        text: t('display-options.auto'),
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
        text: t('language-options.en'),
        icon: locale === 'en' ? <Check /> : undefined,
        disabled: locale === 'en',
        action: () => changeLocale('en'),
      },
      {
        type: 'item',
        text: t('language-options.fr'),
        icon: locale === 'fr' ? <Check /> : undefined,
        disabled: locale === 'fr',
        action: () => changeLocale('fr'),
      },
    ],
    [locale, currentUrl, changeLocale]
  );

  const signOutUserAction = useCallback(async () => {
    await logout();
    toast({
      title: t('sign-out.title'),
      description: t('sign-out.description'),
    });
  }, [logout, toast]);

  const profileSections: HeaderProfileProps['profileSections'] = useMemo(
    () =>
      !safeUser
        ? []
        : [
            {
              type: 'label',
              text: t('profile-sections.my-account'),
              className: 'pt-2 pb-0',
            },
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
              text: t('profile-sections.support'),
              action: () =>
                toast({
                  title: t('profile-sections.support-title'),
                  description: t('profile-sections.support-description'),
                }),
            },
            { type: 'separator' },
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: t('profile-sections.sign-out'),
            },
          ],
    [safeUser, signOutUserAction, toast]
  );

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
        languageText: t('language-text'),
        languageHelperText: t('language-helper-text'),
        displays,
        displayText: t('display-text'),
        displayHelperText: t('display-helper-text'),
      }}
    />
  );
};

export default React.memo(Header);
