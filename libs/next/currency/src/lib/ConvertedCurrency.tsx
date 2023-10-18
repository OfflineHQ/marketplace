'use server';

import type { Money } from '@currency/types';
import { getRates } from '@next/currency-cache';
import { formatCurrency } from '@next/currency-common';
import { Text, TextSkeleton, type TextProps } from '@ui/components';
import { useLocale } from 'next-intl';
import { getFormatter } from 'next-intl/server';
import { Suspense } from 'react';

export interface ConvertedCurrencyProps extends TextProps, Money {}

async function ConvertedCurrencyContent({
  amount,
  currency,
  variant,
  ...textProps
}: ConvertedCurrencyProps) {
  const locale = useLocale();
  const rates = await getRates();
  const formater = await getFormatter(locale);
  const convertedAmount = formatCurrency(
    formater,
    {
      amount,
      currency,
    },
    rates
  );
  return (
    <Text variant={variant} {...textProps}>
      {convertedAmount}
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
