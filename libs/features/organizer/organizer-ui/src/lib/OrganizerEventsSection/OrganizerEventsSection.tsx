import { OrganizerLatestEvents } from '@features/organizer/organizer-types';
import {
  Alert,
  CardContent,
  CardHeader,
  Text,
  TextSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { StaticImageData } from 'next/image';
import {
  OrganizerLatestEventCard,
  OrganizerLatestEventCardProps,
  OrganizerLatestEventCardSkeleton,
} from './OrganizerLatestEventCard';

interface NoEventsPlaceholderProps {
  noEventsImage?: string | StaticImageData;
}

export interface OrganizerEventsSectionProps
  extends NoEventsPlaceholderProps,
    Pick<OrganizerLatestEventCardProps, 'slug'> {
  latestEvents: OrganizerLatestEvents;
}

const NoEventsPlaceholder: React.FC<NoEventsPlaceholderProps> = ({
  noEventsImage,
}) => {
  const t = useTranslations('Organizer.OrganizerEventsSection');
  return (
    <div className="flex flex-col">
      <Alert variant="info" className="max-w-fit">
        {t('noEvents')}
      </Alert>
      {/* <div className="relative h-80 w-80 grow">
        <Image fill src={noEventsImage} alt={t('noEvents')} />
      </div> */}
    </div>
  );
};

export const OrganizerEventsSection: React.FC<OrganizerEventsSectionProps> = ({
  latestEvents,
  noEventsImage,
  slug,
}) => {
  const t = useTranslations('Organizer.OrganizerEventsSection');
  //TODO add placeholder for when no events are available
  return (
    <>
      <CardHeader>
        <Text variant="h2">{t('title')}</Text>
      </CardHeader>
      <CardContent>
        {latestEvents?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {latestEvents.map(
              (event: OrganizerLatestEvents[0], index: number) => (
                <OrganizerLatestEventCard
                  key={index}
                  latestEvent={event}
                  slug={slug}
                />
              ),
            )}
          </div>
        ) : (
          <NoEventsPlaceholder noEventsImage={noEventsImage} />
        )}
      </CardContent>
    </>
  );
};

export const OrganizerEventsSectionSkeleton: React.FC = () => (
  <>
    <CardHeader>
      <Text variant="h2">
        <TextSkeleton variant="h2" />
      </Text>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <OrganizerLatestEventCardSkeleton key={index} />
        ))}
      </div>
    </CardContent>
  </>
);
