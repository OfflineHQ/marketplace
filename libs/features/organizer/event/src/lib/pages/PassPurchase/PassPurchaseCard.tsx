// PassPurchase.tsx
import { AppContainerOverflow } from '@features/app-nav';
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardNavBack,
  CardTitle,
} from '@ui/components';
import React from 'react';
import { PassFooterCardClient } from '../../organisms/PassFooter/PassFooterCardClient';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';
import { PassList, PassListProps } from '../../organisms/PassList/PassList';

export interface PassPurchaseCardProps extends PassListProps {
  backButtonText: string;
  backButtonLink: PropsFrom<typeof Link>;
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
  title: string;
  description: string;
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
  ...footerProps
}) => {
  return (
    <>
      <CardNavBack text={backButtonText} href={backButtonLink} />
      <AppContainerOverflow variant="stickyFooterLg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <PassList
            passes={passes}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
            hasConfirmedPasses={hasConfirmedPasses}
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
