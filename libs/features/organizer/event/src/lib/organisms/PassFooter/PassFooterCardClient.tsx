'use client';

import { Link } from '@next/navigation';
import { useStore } from '@next/store';
import { PropsFrom } from '@next/types';
import { AutoAnimate, Button, CardFooter, CardOverlay } from '@ui/components';
import { Cart } from '@ui/icons';
import React from 'react';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';
import { usePassPurchaseStore } from '../../store/index';

import type { EventPass } from '@features/organizer/event-types';
export interface PassFooterCardProps {
  passes: EventPass[];
  organizerSlug: string;
  eventSlug: string;
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
}
export const PassFooterCardClient: React.FC<PassFooterCardProps> = ({
  passes: passesData,
  organizerSlug,
  eventSlug,
  goPaymentText,
  goPaymentLink,
}) => {
  // useStore here to avoid hydration mismatch
  const store = useStore(usePassPurchaseStore, (state) => state);
  const passesCart = store?.getPassesCart({ organizerSlug, eventSlug }) ?? [];
  return (
    <AutoAnimate className="mt-auto">
      {passesCart?.length ? (
        <>
          <CardOverlay footerHeight="112px" />
          <CardFooter
            variant="sticky"
            className="flex flex-col items-start space-y-2"
          >
            <PassTotal
              passesData={passesData}
              organizerSlug={organizerSlug}
              eventSlug={eventSlug}
            />
            <Link
              {...goPaymentLink}
              legacyBehavior
              passHref
              className="w-full justify-center"
            >
              <Button className={`w-full md:w-1/3`} block icon={<Cart />}>
                {goPaymentText}
              </Button>
            </Link>
          </CardFooter>
        </>
      ) : null}
    </AutoAnimate>
  );
};
