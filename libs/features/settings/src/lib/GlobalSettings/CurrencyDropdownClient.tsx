'use client';

import { Currency_Enum } from '@gql/shared/types';
import { getCurrencyPreference, setCurrencyPreference } from '@next/currency';
import { usePathname, useRouter } from '@next/navigation';
import '@next/types';
import { CurrencyDropdown, type CurrencyDropdownProps } from '@ui/components';
import { Check } from '@ui/icons';
import { useMemo, useTransition } from 'react';

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
  const currency = getCurrencyPreference();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currencies: CurrencyDropdownProps['items'] = useMemo(() => {
    const changeCurrency = (newCurrency: Currency_Enum) => {
      startTransition(() => {
        setCurrencyPreference(newCurrency);
        router.replace(pathname);
      });
    };
    return [
      {
        type: 'item',
        text: currencySelectText['usd'],
        icon: currency === Currency_Enum.Usd ? <Check /> : undefined,
        disabled: currency === Currency_Enum.Usd,
        action: () => changeCurrency(Currency_Enum.Usd),
      },
      {
        type: 'item',
        text: currencySelectText['eur'],
        icon: currency === Currency_Enum.Eur ? <Check /> : undefined,
        disabled: currency === Currency_Enum.Eur,
        action: () => changeCurrency(Currency_Enum.Eur),
      },
    ];
  }, [currencySelectText, currency, pathname, router]);

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
