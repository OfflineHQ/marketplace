import {
  AppContainer,
  AppContainerFooter,
  AppContainerHeader,
  AppContainerOverflow,
} from '@features/app-nav';
import { LoyaltyCardOrganizer } from '@features/back-office/loyalty-card-types';
import {
  Accordion,
  CardContent,
  CardTitle,
  TableSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { LoyaltyCardFooter } from '../../molecules/LoyaltyCardFooter/LoyaltyCardFooter';
import { LoyaltyCardNftsInfos } from '../../molecules/LoyaltyCardNftsInfos/LoyaltyCardNftsInfos';
import { LoyaltyCardNftsPasswords } from '../../molecules/LoyaltyCardNftsPasswords/LoyaltyCardNftsPasswords';

export interface LoyaltyCardPageProps {
  loyaltyCard?: LoyaltyCardOrganizer | null;
}

export function LoyaltyCardPage({ loyaltyCard }: LoyaltyCardPageProps) {
  const t = useTranslations('OrganizerLoyaltyCard.Card');
  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>{t('title')}</CardTitle>
      </AppContainerHeader>
      <AppContainerOverflow variant="stickyFooter">
        <CardContent>
          {loyaltyCard && (
            <Accordion type="multiple" defaultValue={['nft-infos']}>
              <LoyaltyCardNftsInfos
                title={t('LoyaltyCardNftsInfos.title')}
                loyaltyCard={loyaltyCard}
              />
              <LoyaltyCardNftsPasswords
                contractAddress={
                  loyaltyCard.loyaltyCardNftContract?.contractAddress || ''
                }
                loyaltyCardId={loyaltyCard.id}
                chainId={loyaltyCard.loyaltyCardNftContract?.chainId || ''}
              />
            </Accordion>
          )}
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>
        <LoyaltyCardFooter
          {...(loyaltyCard as LoyaltyCardOrganizer)}
          amount={100} // TODO: set by user or later after deployment of contract ?
        />
      </AppContainerFooter>
    </AppContainer>
  );
}

export function LoyaltyCardSkeleton() {
  const t = useTranslations('OrganizerLoyaltyCard.Card');
  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>{t('title')}</CardTitle>
      </AppContainerHeader>
      <TableSkeleton rows={10} cols={3} />
    </AppContainer>
  );
}
