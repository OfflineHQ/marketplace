import { delayData } from '@test-utils/functions';
import { Event } from '../types';
import { cache } from 'react';
import { getNextAppURL } from '@utils';

interface GetEventProps {
  eventSlug: string;
  organizerSlug: string;
}

export const getEvent = cache(
  async ({ eventSlug, organizerSlug }: GetEventProps): Promise<Event> => {
    // TODO implement
    const data = await fetch(`${getNextAppURL()}/mocks/event.json`);
    const event = await data.json();
    await delayData(2000, null);
    return event as Event;
  }
);
