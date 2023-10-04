'use client';

import { defaultLocale } from '@next/i18n';
import { usePathname, useRouter } from '@next/navigation';
import { LanguageDropdown, type LanguageDropdownProps } from '@ui/components';
import { Check } from '@ui/icons';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import '@next/types';

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
  const locale = useParams()?.locale || defaultLocale;
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
    let url;
    const pathParts = currentUrl.split('/');
    if (
      pathParts[1] &&
      Object.prototype.hasOwnProperty.call(languageSelectText, pathParts[1])
    ) {
      // replace existing locale in url
      pathParts[1] = newLocale;
      url = pathParts.join('/');
    } else {
      // prepend new locale to url
      url = '/' + newLocale + currentUrl;
    }
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
