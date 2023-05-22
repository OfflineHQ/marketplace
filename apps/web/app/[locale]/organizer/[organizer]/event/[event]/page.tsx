import { getEvent } from '@features/organizer/event/server';
import { Event, PassPurchase } from '@features/organizer/event';

export default async function EventPage({ event: _event, organizer, locale }) {
  const event = await getEvent({ organizer, event: _event });
  return (
    <>
      <Event {...event} />
      <PassPurchase {...event} />
    </>
  );
}
