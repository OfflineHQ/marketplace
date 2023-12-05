import type {
  Organizer,
  OrganizerLatestEvents,
} from '@features/organizer/organizer-types';
import { Link } from '@next/navigation';
import {
  AspectRatio,
  AspectRatioSkeleton,
  Text,
  TextSkeleton,
} from '@ui/components';
import Image from 'next/image';

export interface OrganizerLatestEventCardProps {
  latestEvent: OrganizerLatestEvents[0];
  slug: Organizer['slug'];
}

export const OrganizerLatestEventCard: React.FC<
  OrganizerLatestEventCardProps
> = ({ latestEvent, slug }) => {
  return (
    <Link
      href={`/organizer/${slug}/event/${latestEvent?.event?.slug}`}
      className="cursor-pointer transition-all hover:scale-105"
    >
      <AspectRatio variant="classic">
        <Image
          className="rounded-sm object-cover"
          src={latestEvent?.event?.heroImage?.url || '/image-placeholder.svg'}
          fill
          alt={latestEvent.event?.title || ''}
        />
      </AspectRatio>
      <Text variant="h3" className="pt-3">
        {latestEvent?.event?.title}
      </Text>
    </Link>
  );
};

export const OrganizerLatestEventCardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <AspectRatioSkeleton variant="classic" className="rounded-sm" />
    <TextSkeleton variant="h3" className="pt-3" />
  </div>
);
