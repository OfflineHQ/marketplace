'use client';
import { deleteEventPasses } from '@features/cart-actions';
import type { EventPassCart } from '@features/cart-types';
import type { EventSlugs } from '@features/organizer/event-types';
import { Link } from '@next/navigation';
import { Button, toast } from '@ui/components';
import { Delete, Edit } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

export interface EventPassesActionsProps extends EventSlugs {
  editText: string;
  deleteText: string;
  passes: EventPassCart[];
}

export const EventPassesActions: React.FC<EventPassesActionsProps> = ({
  editText,
  deleteText,
  eventSlug,
  organizerSlug,
  passes,
}) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Cart.List.Event');

  return (
    <div className="mb-4 flex flex-wrap items-center justify-end space-x-6">
      <Link
        className="mt-4 inline-flex"
        passHref
        href={`/organizer/${organizerSlug}/event/${eventSlug}/purchase`}
      >
        <Button variant="outline" icon={<Edit />}>
          {editText}
        </Button>
      </Link>

      <Button
        variant="destructive"
        className="mt-4"
        icon={<Delete />}
        onClick={() =>
          startTransition(async () => {
            try {
              await deleteEventPasses({
                organizerSlug,
                eventSlug,
                eventPassIds: passes
                  .filter(({ eventPassId }) => !!eventPassId)
                  .map(({ eventPassId }) => eventPassId as string),
              });
            } catch (e) {
              console.error(e);
              toast({
                title: t('delete-error-title'),
                description: t('delete-error-description'),
              });
            }
          })
        }
      >
        {deleteText}
      </Button>
    </div>
  );
};
