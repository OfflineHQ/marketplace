'use client';

import {
  BoundedNumericStepper,
  BoundedNumericStepperProps,
} from '@ui/components';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { EventSlugs } from '@features/organizer/event-types';

export interface PassCardSelectClientProps
  extends Omit<BoundedNumericStepperProps, 'onChange' | 'disabled'>,
    EventSlugs {
  eventPassId: string;
  updateEventPassCart: () => Promise<void>;
}

//TODO: here handle error cases from updateEventPassCart (display with toast)
export const PassCardSelectClient: React.FC<PassCardSelectClientProps> = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  updateEventPassCart,
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
            // pb with revalidatePath or revalidateTag, (error 404 in updateEventPassCart) so refresh for now
            router.refresh();
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
