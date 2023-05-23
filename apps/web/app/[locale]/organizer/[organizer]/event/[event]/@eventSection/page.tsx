import { getEvent } from '@features/organizer/event/server';
import { Event, type EventProps } from '@features/organizer/event';
import { useTranslations } from 'next-intl';

export default async function EventSection({
  event: _event,
  organizer,
  locale,
}) {
  const t = useTranslations('Organizer.Event');
  const event = await getEvent({ organizer, event: _event });
  return (
    <Event
      {...event}
      buyFunction={() => null}
      buyText={t('purchase-button-activator')}
      organizer={organizer}
      detailsTitle={t('details.title')}
    />
  );
}
