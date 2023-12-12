import { AppContainerFooter } from '@features/app-nav';
import { getEventPassesCart } from '@features/organizer/event-api';
import type { EventPass } from '@features/organizer/event-types';
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { AutoAnimate, Button } from '@ui/components';
import { Cart } from '@ui/icons';
import React, { Suspense } from 'react';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';
export interface PassFooterCardProps {
  passes: EventPass[];
  organizerSlug: string;
  eventSlug: string;
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
}

export const PassFooterCardClient: React.FC<PassFooterCardProps> = (props) => {
  return (
    <Suspense>
      <PassFooterCardClientContent {...props} />
    </Suspense>
  );
};
export const PassFooterCardClientContent: React.FC<
  PassFooterCardProps
> = async ({
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
    <AutoAnimate>
      {passesCart?.length ? (
        <AppContainerFooter className="flex flex-col items-start space-y-2">
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
        </AppContainerFooter>
      ) : null}
    </AutoAnimate>
  );
};
