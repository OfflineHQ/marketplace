import { delayData } from '@test-utils/functions';
import { EventCart } from '../types';
import { eventProps } from '@features/organizer/event/examples';

interface getEventCartProps {
  eventSlug: string;
  organizerSlug: string;
}

export const getEventCart = async ({
  eventSlug,
  organizerSlug,
}: getEventCartProps): Promise<EventCart> => {
  // TODO implement

  await delayData(2000, null);
  const _event: EventCart = {
    ...eventProps,
  };
  return _event;
};
