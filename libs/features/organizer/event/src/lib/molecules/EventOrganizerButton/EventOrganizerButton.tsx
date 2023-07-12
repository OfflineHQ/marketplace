import {
  Text,
  TextSkeleton,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarSkeleton,
} from '@ui/components';
import Link from 'next/link';
import { Event } from '../../types';
import { getInitials } from '@ui/shared';

export type EventOrganizerButtonProps = NonNullable<Event['organizer']>;

const layout = {
  container: 'inline-flex h-14 items-center space-x-3 p-0 pr-2 md:h-16 md:pr-4',
};

export const EventOrganizerButton: React.FC<EventOrganizerButtonProps> = ({
  name,
  image,
  slug,
}) => {
  return (
    <Link href={`/organizer/${slug}`} passHref>
      <Button variant="ghost" className={layout.container}>
        <Avatar size="lg" className="m-1">
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
          <AvatarImage src={image?.url} />
        </Avatar>
        <Text variant="h4" className="flex items-center justify-center">
          <div className="tracking-wider">{name}</div>
        </Text>
      </Button>
    </Link>
  );
};

export const EventOrganizerButtonSkeleton: React.FC = () => {
  return (
    <div className={layout.container}>
      <AvatarSkeleton size="lg" />
      <TextSkeleton variant="h4" />
    </div>
  );
};
