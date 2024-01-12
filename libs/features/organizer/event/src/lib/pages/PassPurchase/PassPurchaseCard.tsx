// PassPurchase.tsx
import {
  AppContainerNavBack,
  AppContainerNavBackProps,
  AppContainerOverflow,
} from '@features/app-nav';
import { getSaleStatus } from '@features/organizer/event-actions';
import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { CardContent, CardHeader, CardTitle } from '@ui/components';
import { useTranslations } from 'next-intl';
import React from 'react';
import { PassPurchaseHeader } from '../../molecules/PassPurchaseHeader/PassPurchaseHeader';
import { PassFooterCardClient } from '../../organisms/PassFooter/PassFooterCardClient';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';
import { PassList, PassListProps } from '../../organisms/PassList/PassList';

export interface PassPurchaseCardProps
  extends Omit<PassListProps, 'saleStatus'> {
  backButtonText: string;
  backButtonLink: AppContainerNavBackProps['href'];
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
  eventTitle: string;
  eventParameters: EventParametersPasses;
}

export const PassPurchaseCard: React.FC<PassPurchaseCardProps> = ({
  passes,
  backButtonText,
  backButtonLink,
  organizerSlug,
  eventSlug,
  hasConfirmedPasses,
  eventParameters,
  eventTitle,
  ...footerProps
}) => {
  const saleStatus = getSaleStatus(eventParameters);
  const t = useTranslations('Organizer.Event.PassPurchase');
  return (
    <>
      <AppContainerNavBack text={backButtonText} href={backButtonLink} />
      <AppContainerOverflow variant="stickyFooterLg">
        <CardHeader className="mt-8">
          <CardTitle>{t('title-with-event', { eventTitle })}</CardTitle>
          <PassPurchaseHeader
            isCard
            eventParameters={eventParameters}
            hasConfirmedPasses={hasConfirmedPasses}
            saleStatus={saleStatus}
          />
        </CardHeader>
        <CardContent>
          <PassList
            passes={passes}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
            hasConfirmedPasses={hasConfirmedPasses}
            saleStatus={saleStatus}
          />
        </CardContent>
      </AppContainerOverflow>
      {!hasConfirmedPasses && saleStatus === SaleStatus.Ongoing && (
        <PassFooterServer>
          <PassFooterCardClient
            passes={passes}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
            {...footerProps}
          />
        </PassFooterServer>
      )}
    </>
  );
};
