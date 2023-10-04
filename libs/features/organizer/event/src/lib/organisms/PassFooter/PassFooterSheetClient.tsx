'use client';

import { Link } from '@next/navigation';
import { useStore } from '@next/store';
import { PropsFrom } from '@next/types';
import { AutoAnimate, Button, SheetFooter, SheetOverlay } from '@ui/components';
import { Cart } from '@ui/icons';
import React from 'react';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';
import { usePassPurchaseStore } from '../../store/index';

import type { EventPass } from '@features/organizer/event-types';
export interface PassFooterSheetProps {
  passes: EventPass[];
  organizerSlug: string;
  eventSlug: string;
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
}
export const PassFooterSheetClient: React.FC<PassFooterSheetProps> = ({
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
          <SheetOverlay footerHeight="112px" />
          <SheetFooter
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
          </SheetFooter>
        </>
      ) : null}
    </AutoAnimate>
  );
};
