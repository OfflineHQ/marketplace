'use client';
import { deleteEventPasses } from '@features/cart-actions';
import type {
  EventPassCart,
  EventSlugs,
} from '@features/organizer/event-types';
import { Link, useRouter } from '@next/navigation';
import { Button } from '@ui/components';
import { Delete, Edit } from '@ui/icons';
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
  const router = useRouter();
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
                eventPassIds: passes.map(({ eventPassId }) => eventPassId),
              });
              // pb with revalidatePath or revalidateTag, (error 404 in updateEventPassCart) so refresh for now
              router.refresh();
            } catch (e) {
              console.error(e);
              // TODO handle error with toast
            }
          })
        }
      >
        {deleteText}
      </Button>
    </div>
  );
};
