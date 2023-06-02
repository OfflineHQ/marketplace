'use client';

import { LanguageDropdown, type LanguageDropdownProps } from '@ui/components';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next-intl/client';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Check } from '@ui/icons';
import { defaultLocale } from '@client/i18n';

export interface LanguageDropdownClientProps {
  languageSelectText: {
    en: string;
    fr: string;
  };
  languageText: string;
  className?: string;
}
export const LanguageDropdownClient: React.FC<LanguageDropdownClientProps> = ({
  languageSelectText,
  languageText,
  className,
}) => {
  const locale = useParams().locale || defaultLocale;
  const router = useRouter();
  // need this little hack to avoid issue in storybook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = window?.STORYBOOK_ENV ? '' : (usePathname() as string);
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

  const languages: LanguageDropdownProps['items'] = useMemo(
    () => [
      {
        type: 'item',
        text: languageSelectText['en'],
        icon: locale === 'en' ? <Check /> : undefined,
        disabled: locale === 'en',
        action: () => changeLocale('en'),
      },
      {
        type: 'item',
        text: languageSelectText['fr'],
        icon: locale === 'fr' ? <Check /> : undefined,
        disabled: locale === 'fr',
        action: () => changeLocale('fr'),
      },
    ],
    [languageSelectText, locale, changeLocale]
  );

  return (
    <LanguageDropdown items={languages} className={className}>
      {languageText}
    </LanguageDropdown>
  );
};
