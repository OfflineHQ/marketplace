'use client';

import {
  BoundedNumericStepper,
  BoundedNumericStepperProps,
  useToast,
} from '@ui/components';
import { useTransition } from 'react';

import { updateEventPassCart } from '@features/organizer/event-actions';
import { EventSlugs } from '@features/organizer/event-types';
import { useTranslations } from 'next-intl';

export interface PassCardSelectClientProps
  extends Omit<BoundedNumericStepperProps, 'onChange' | 'disabled'>,
    EventSlugs {
  eventPassId: string;
}

//TODO: here handle error cases from updateEventPassCart (display with toast)
export const PassCardSelectClient: React.FC<PassCardSelectClientProps> = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  ...boundedNumericStepperProps
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations('Organizer.Event.PassPurchase');

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
          } catch (e) {
            console.error(e);
            toast({
              title: t('error-title'),
              description: t('error-description'),
            });
          }
        })
      }
      {...boundedNumericStepperProps}
    />
  );
};
