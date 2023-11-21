import { getEventPassesCart } from '@features/organizer/event-api';
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import {
  AutoAnimate,
  Button,
  ButtonSkeleton,
  SheetFooter,
  SheetOverlay,
} from '@ui/components';
import { Cart } from '@ui/icons';
import React, { Suspense } from 'react';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';

import type { EventPass } from '@features/organizer/event-types';
export interface PassFooterSheetProps {
  passes: EventPass[];
  organizerSlug: string;
  eventSlug: string;
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
}

export const PassFooterSheet: React.FC<PassFooterSheetProps> = (props) => {
  return (
    <Suspense fallback={<ButtonSkeleton className="w-full md:w-1/6" />}>
      <PassFooterSheetContent {...props} />
    </Suspense>
  );
};

export const PassFooterSheetContent: React.FC<PassFooterSheetProps> = async ({
  passes: passesData,
  organizerSlug,
  eventSlug,
  goPaymentText,
  goPaymentLink,
}) => {
  const passesCart = await getEventPassesCart({
    organizerSlug,
    eventSlug,
    eventPassIds: passesData.map(({ id }) => id),
  });
  return (
    <AutoAnimate className="mt-auto">
      {passesCart?.length ? (
        <>
          <SheetOverlay footerHeight="112px" />
          <SheetFooter
            variant="sticky"
            className="flex flex-col items-start space-y-2"
          >
            <PassTotal passesData={passesData} passesCart={passesCart} />
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
