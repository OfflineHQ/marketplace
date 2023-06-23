// PassPurchase.tsx
import React from 'react';
import Link, { type LinkProps } from 'next/link';
import {
  type SheetNavigationProps,
  CardOverflow,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardNavBack,
} from '@ui/components';
import { PassList, PassListProps } from '../../organisms/PassList/PassList';
import { PassFooterCardClient } from '../../organisms/PassFooter/PassFooterCardClient';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';

export interface PassPurchaseCardProps extends PassListProps {
  backButtonText: string;
  backButtonLink: LinkProps;
  goPaymentText: string;
  goPaymentLink: LinkProps;
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
  ...footerProps
}) => {
  return (
    <>
      <CardNavBack text={backButtonText} href={backButtonLink} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardOverflow>
        <CardContent>
          <PassList
            passes={passes}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
          />
        </CardContent>
      </CardOverflow>
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
