import { delayData } from '@test-utils/functions';
import { EventPass } from '../types';
import { passTotalProps } from '../molecules/PassTotal/examples';

interface GetEventProps {
  organizerSlug: string;
  eventSlug: string;
}

export const getEventPasses = async ({
  organizerSlug,
  eventSlug,
}: GetEventProps): Promise<EventPass[]> => {
  // TODO implement

  await delayData(4000, null);
  const passes: EventPass[] = passTotalProps['passes'];
  return passes;
};
