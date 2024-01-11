// PassPurchase.tsx
import {
  AppContainerNavBack,
  AppContainerNavBackProps,
  AppContainerOverflow,
} from '@features/app-nav';
import { getSaleStatus } from '@features/organizer/event-actions';
import { EventParametersPasses } from '@features/organizer/event-types';
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components';
import React from 'react';
import { PassFooterCardClient } from '../../organisms/PassFooter/PassFooterCardClient';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';
import { PassList, PassListProps } from '../../organisms/PassList/PassList';

export interface PassPurchaseCardProps
  extends Omit<PassListProps, 'saleStatus'> {
  backButtonText: string;
  backButtonLink: AppContainerNavBackProps['href'];
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
  title: string;
  description: string;
  eventParameters: EventParametersPasses;
}

export const PassPurchaseCard: React.FC<PassPurchaseCardProps> = ({
  passes,
  description,
  title,
  backButtonText,
  backButtonLink,
  organizerSlug,
  eventSlug,
  hasConfirmedPasses,
  eventParameters,
  ...footerProps
}) => {
  const saleStatus = getSaleStatus(eventParameters);
  return (
    <>
      <AppContainerNavBack text={backButtonText} href={backButtonLink} />
      <AppContainerOverflow variant="stickyFooterLg">
        <CardHeader className="mt-8">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
      <PassFooterServer>
        <PassFooterCardClient
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          {...footerProps}
        />
      </PassFooterServer>
    </>
  );
};
