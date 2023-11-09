'use server';

import type { Money } from '@currency/types';
import { CurrencyCache } from '@next/currency-cache';
import { formatCurrency } from '@next/currency-common';
import { Text, TextSkeleton, type TextProps } from '@ui/components';
import { useLocale } from 'next-intl';
import { getFormatter } from 'next-intl/server';
import { Suspense } from 'react';

export interface ConvertedCurrencyProps extends TextProps, Money {
  translationFn?: (convertedAmount: string) => string;
}

const currencyCache = new CurrencyCache();

async function ConvertedCurrencyContent({
  amount,
  currency,
  variant,
  translationFn,
  ...textProps
}: ConvertedCurrencyProps) {
  const locale = useLocale();
  const rates = await currencyCache.getRates();
  const formater = await getFormatter(locale);
  const convertedAmount = formatCurrency(
    formater,
    {
      amount,
      currency,
    },
    rates,
  );

  const content = translationFn
    ? translationFn(convertedAmount)
    : convertedAmount;

  return (
    <Text variant={variant} {...textProps}>
      {content}
    </Text>
  );
}

export async function ConvertedCurrency({
  variant,
  ...props
}: ConvertedCurrencyProps) {
  return (
    <Suspense fallback={<TextSkeleton variant={variant} />}>
      <ConvertedCurrencyContent variant={variant} {...props} />
    </Suspense>
  );
}
