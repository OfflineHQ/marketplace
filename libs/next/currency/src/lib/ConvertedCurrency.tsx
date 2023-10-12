'use server';

import type { Money } from '@currency/types';
import { formatCurrency } from './formatCurrency';
import { getRates } from '@next/currency-cache';
import { Text, TextSkeleton, type TextProps } from '@ui/components';
import { getFormatter } from 'next-intl/server';
import { Suspense } from 'react';

export interface ConvertedCurrencyProps extends TextProps, Money {}

async function ConvertedCurrencyContent({
  amount,
  currency,
  variant,
  ...textProps
}: ConvertedCurrencyProps) {
  const rates = await getRates();
  const formater = await getFormatter();
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
