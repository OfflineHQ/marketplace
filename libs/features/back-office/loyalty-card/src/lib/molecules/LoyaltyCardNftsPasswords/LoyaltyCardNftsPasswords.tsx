import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TableSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import {
  LoyaltyCardNftsPasswordsTable,
  LoyaltyCardNftsPasswordsTableProps,
} from '../LoyaltyCardNftsPasswordsTable/LoyaltyCardNftsPasswordsTable';

export type LoyaltyCardNftsPasswordsProps = Omit<
  LoyaltyCardNftsPasswordsTableProps,
  'className'
>;

export function LoyaltyCardNftsPasswords({
  contractAddress,
  ...props
}: LoyaltyCardNftsPasswordsProps) {
  const t = useTranslations(
    'OrganizerLoyaltyCard.Card.LoyaltyCardNftsPasswords',
  );

  return (
    <AccordionItem value="nft-codes" disabled={!contractAddress}>
      <AccordionTrigger>{t('title')}</AccordionTrigger>
      <AccordionContent className="w-full flex-col space-y-4 py-4">
        <Suspense fallback={<TableSkeleton rows={10} cols={2} />}>
          <LoyaltyCardNftsPasswordsTable
            contractAddress={contractAddress}
            {...props}
            className="min-w-fit"
          />
        </Suspense>
      </AccordionContent>
    </AccordionItem>
  );
}
