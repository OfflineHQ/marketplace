import { delayData } from '@test-utils/functions';
import { EventCart } from '../types';
import { cache } from 'react';
import { getNextAppURL } from '@utils';

interface getEventCartProps {
  eventSlug: string;
  organizerSlug: string;
}

export const getEventCart = cache(
  async ({
    eventSlug,
    organizerSlug,
  }: getEventCartProps): Promise<EventCart> => {
    // TODO implement
    const data = await fetch(`${getNextAppURL()}/mocks/event_cart.json`);
    const event = await data.json();
    event.slug = eventSlug;
    event.organizer.slug = organizerSlug;
    await delayData(2000, null);
    return event as EventCart;
  }
);
