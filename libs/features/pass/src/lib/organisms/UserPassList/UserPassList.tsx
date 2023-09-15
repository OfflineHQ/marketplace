import { Accordion, Text, Alert } from '@ui/components';
import {
  UserPassEvent,
  type UserPassEventProps,
} from '../UserPassEvent/UserPassEvent';
import { useTranslations } from 'next-intl';
import { UserPassEventSkeleton } from '../UserPassEvent/UserPassEvent';
import {
  NoPassPlaceholder,
  type NoPassPlaceholderProps,
} from '../../molecules/NoPassPlaceholder/NoPassPlaceholder';

export interface UserPassListProps
  extends Pick<NoPassPlaceholderProps, 'noPassImage'> {
  eventsParameters: UserPassEventProps['eventParameters'][];
  actionsFunctions: UserPassEventProps['actionsFunctions'];
  batchDownloadOrReveal: UserPassEventProps['batchDownloadOrReveal'];
}

export const UserPassList: React.FC<UserPassListProps> = ({
  eventsParameters,
  noPassImage,
  actionsFunctions,
  batchDownloadOrReveal,
}) => {
  const t = useTranslations('Pass.UserPass');
  return eventsParameters.length ? (
    <Accordion
      type="multiple"
      defaultValue={[eventsParameters[0].event?.slug as string]}
    >
      {eventsParameters.map((eventParameters) => (
        <div key={eventParameters.event?.slug}>
          <UserPassEvent
            eventParameters={eventParameters}
            actionsFunctions={actionsFunctions}
            batchDownloadOrReveal={batchDownloadOrReveal}
          />
        </div>
      ))}
    </Accordion>
  ) : (
    <NoPassPlaceholder noPassImage={noPassImage} noPassText={t('no-pass')} />
  );
};

export const UserPassListSkeleton: React.FC = () => {
  // Here you can customize how many skeleton items you want to render.
  const skeletonItemsCount = 3;

  return (
    <Accordion type="multiple">
      {Array.from({ length: skeletonItemsCount }).map((_, index) => (
        <div key={index}>
          <UserPassEventSkeleton />
        </div>
      ))}
    </Accordion>
  );
};
