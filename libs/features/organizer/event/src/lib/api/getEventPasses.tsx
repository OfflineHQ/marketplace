import { delayData } from '@test-utils/functions';
import { EventPass } from '../types';
import { cache } from 'react';
import { getNextAppURL } from '@utils';

interface GetEventProps {
  organizerSlug: string;
  eventSlug: string;
}

export const getEventPasses = cache(
  async ({ organizerSlug, eventSlug }: GetEventProps): Promise<EventPass[]> => {
    // TODO implement
    const data = await fetch(`${getNextAppURL()}/mocks/event_passes.json`);
    const passes = await data.json();
    await delayData(3000, null);
    return passes as EventPass[];
  }
);
