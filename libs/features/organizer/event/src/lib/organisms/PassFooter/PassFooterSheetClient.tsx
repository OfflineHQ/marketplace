'use client';

import React from 'react';
import { Button, AutoAnimate, SheetOverlay, SheetFooter } from '@ui/components';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';
import { usePassPurchaseStore } from '../../store/index';
import { useStore } from '@next/store';
import Link, { type LinkProps } from 'next/link';
import { Cart } from '@ui/icons';

import type { EventPass } from '../../types';
export interface PassFooterSheetProps {
  passes: EventPass[];
  organizerSlug: string;
  eventSlug: string;
  goPaymentText: string;
  goPaymentLink: LinkProps;
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
              <Button className={`w-full md:w-1/3`} block icon={Cart}>
                {goPaymentText}
              </Button>
            </Link>
          </SheetFooter>
        </>
      ) : null}
    </AutoAnimate>
  );
};
