import { usePathname, useRouter } from '@next/navigation';
import { CurrencyDropdown, type CurrencyDropdownProps } from '@ui/components';
import { Check } from '@ui/icons';
import { useLocale } from 'next-intl';
import { useMemo, useTransition } from 'react';
import { setCurrencyPreference, getCurrencyPreference } from '@next/currency';
import '@next/types';

export interface CurrencyDropdownClientProps {
  currencySelectText: {
    usd: string;
    eur: string;
  };
  currencyText: string;
  className?: string;
}

export const CurrencyDropdownClient: React.FC<CurrencyDropdownClientProps> = ({
  currencySelectText,
  currencyText,
  className,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currencies: CurrencyDropdownProps['items'] = useMemo(() => {
    const changeCurrency = (newCurrency: string) => {
      startTransition(() => {
        setCurrencyPreference(newCurrency);
        router.replace(pathname, { locale: getCurrencyPreference() });
      });
    };
    return [
      {
        type: 'item',
        text: currencySelectText['usd'],
        icon: locale === 'usd' ? <Check /> : undefined,
        disabled: locale === 'usd',
        action: () => changeCurrency('usd'),
      },
      {
        type: 'item',
        text: currencySelectText['eur'],
        icon: locale === 'eur' ? <Check /> : undefined,
        disabled: locale === 'eur',
        action: () => changeCurrency('eur'),
      },
    ];
  }, [currencySelectText, locale, pathname, router]);

  return (
    <CurrencyDropdown
      items={currencies}
      className={className}
      disabled={isPending}
    >
      {currencyText}
    </CurrencyDropdown>
  );
};
