import { Text } from '@ui/components';
import { useFormatter, useTranslations } from 'next-intl';
import { formatCurrency } from '../../../../libs/next/currency-common/src/lib/formatCurrency';
import { useCurrency } from './currencyProvider.mock';

export function ConvertedCurrency({
  amount,
  currency,
  variant,
  translationKey,
  ...textProps
}) {
  const { rates } = useCurrency();
  const formater = useFormatter();
  const convertedAmount = formatCurrency(
    formater,
    {
      amount,
      currency,
    },
    rates,
  );
  const t = useTranslations();

  const content = translationKey
    ? t(translationKey, { convertedAmount })
    : convertedAmount;
  return (
    <Text variant={variant} {...textProps}>
      {content}
    </Text>
  );
}
