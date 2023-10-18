'use client';

import {
  BoundedNumericStepper,
  BoundedNumericStepperProps,
} from '@ui/components';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { updateEventPassCart } from '@features/organizer/event-actions';
import { EventSlugs } from '@features/organizer/event-types';

export interface PassCardSelectClientProps
  extends Omit<BoundedNumericStepperProps, 'onChange' | 'disabled'>,
    EventSlugs {
  eventPassId: string;
  updateEventPassCart: typeof updateEventPassCart;
}

//TODO: here handle error cases from updateEventPassCart (display with toast)
export const PassCardSelectClient: React.FC<PassCardSelectClientProps> = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  ...boundedNumericStepperProps
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <BoundedNumericStepper
      onChange={(quantity) =>
        startTransition(async () => {
          try {
            await updateEventPassCart({
              organizerSlug,
              eventSlug,
              eventPassId,
              quantity,
            });
            // pb with revalidatePath, so refresh for now
            router.refresh();
            // revalidatePath(
            //   `en/organizer/${organizerSlug}/event/${eventSlug}/purchase`,
            // );
          } catch (e) {
            console.error(e);
            // TODO handle error with toast
          }
        })
      }
      {...boundedNumericStepperProps}
    />
  );
};
