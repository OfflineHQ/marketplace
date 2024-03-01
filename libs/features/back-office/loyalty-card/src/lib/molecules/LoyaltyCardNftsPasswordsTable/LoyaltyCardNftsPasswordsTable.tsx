import { getNftMintPasswordsForContract } from '@features/back-office/loyalty-card-api';
import { Locale, messages } from '@next/i18n';
import {
  getTableHeaderControlText,
  getTableNoResultText,
  getTablePaginationControlText,
} from '@next/i18n-ui';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  LoyaltyCardNftsPasswordsTableClient,
  LoyaltyCardNftsPasswordsTableClientProps,
} from './LoyaltyCardNftsPasswordsTableClient';

export interface LoyaltyCardNftsPasswordsTableProps
  extends Pick<
    LoyaltyCardNftsPasswordsTableClientProps,
    'className' | 'contractAddress' | 'chainId' | 'loyaltyCardId'
  > {}

export async function LoyaltyCardNftsPasswordsTable({
  contractAddress,
  chainId,
  ...props
}: LoyaltyCardNftsPasswordsTableProps) {
  const data = await getNftMintPasswordsForContract({
    contractAddress,
    chainId,
  });
  const locale = useLocale() as Locale;
  const headerControlText = await getTableHeaderControlText(locale);
  const noResultsText = await getTableNoResultText(locale);
  const paginationPropsText = await getTablePaginationControlText(locale);
  const paginationProps = {
    controlText: paginationPropsText,
  };
  const localeMessages = deepPick(messages[locale], [
    'OrganizerLoyaltyCard.Card.LoyaltyCardNftsPasswordsTable',
    'OrganizerLoyaltyCard.Card.AddMoreNftsPasswordsDrawer',
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <LoyaltyCardNftsPasswordsTableClient
        data={data}
        paginationProps={paginationProps}
        noResultsText={noResultsText}
        headerControlText={headerControlText}
        contractAddress={contractAddress}
        chainId={chainId}
        {...props}
      />
    </NextIntlClientProvider>
  );
}
