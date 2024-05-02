'use client';

import {
  BoundedNumericStepper,
  BoundedNumericStepperProps,
  useToast,
} from '@ui/components';
import { useState, useTransition } from 'react';

import { updateEventPassCart } from '@features/organizer/event-actions';
import { EventSlugs } from '@features/organizer/event-types';
import { useRouter } from '@next/navigation';
import { useTranslations } from 'next-intl';

export interface PassCardSelectClientProps
  extends Omit<BoundedNumericStepperProps, 'onChange' | 'disabled' | 'value'>,
    EventSlugs {
  eventPassId: string;
}

export const PassCardSelectClient: React.FC<PassCardSelectClientProps> = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  ...boundedNumericStepperProps
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [value, setValue] = useState(
    boundedNumericStepperProps.initialValue || 0,
  );
  const { toast } = useToast();
  const t = useTranslations('Organizer.Event.PassPurchase');

  return (
    <BoundedNumericStepper
      isPending={isPending}
      value={value}
      onChange={(quantity) =>
        startTransition(async () => {
          try {
            await updateEventPassCart({
              organizerSlug,
              eventSlug,
              eventPassId,
              quantity,
            });
            setValue(quantity);
            router.refresh();
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
