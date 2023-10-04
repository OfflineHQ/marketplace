'use client';

import { usePathname, useRouter } from '@next/navigation';
import { LanguageDropdown, type LanguageDropdownProps } from '@ui/components';
import { Check } from '@ui/icons';
import { useLocale } from 'next-intl';
import { useMemo, useTransition } from 'react';
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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
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
    <LanguageDropdown
      items={languages}
      className={className}
      disabled={isPending}
    >
      {languageText}
    </LanguageDropdown>
  );
};
