import { delayData } from '@test-utils/functions';
import { Event } from '../types';
import { eventProps } from '../pages/Event/examples';
import { passTotalProps } from '../molecules/PassTotal/examples';

interface GetEventProps {
  organizer: string;
  event: string;
}

export const getEvent = async ({
  organizer,
  event,
}: GetEventProps): Promise<Event> => {
  // TODO implement

  await delayData(3000, null);
  const _event: Event = {
    ...eventProps,
    ...passTotalProps,
    isOngoing: true,
  };
  return _event;
};
