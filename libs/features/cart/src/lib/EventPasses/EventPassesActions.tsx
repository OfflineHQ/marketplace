'use client';
import type { EventSlugs } from '@features/organizer/event-types';
import type { EventPassesSliceProps } from '@features/organizer/event/store';
import { Link } from '@next/navigation';
import { Button } from '@ui/components';
import { Delete, Edit } from '@ui/icons';

export interface EventPassesActionsProps extends EventSlugs {
  onDelete: EventPassesSliceProps['deletePassesCart'];
  editText: string;
  deleteText: string;
}

export const EventPassesActions: React.FC<EventPassesActionsProps> = ({
  onDelete,
  editText,
  deleteText,
  eventSlug,
  organizerSlug,
}) => {
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
        onClick={() => onDelete({ eventSlug, organizerSlug })}
      >
        {deleteText}
      </Button>
    </div>
  );
};
