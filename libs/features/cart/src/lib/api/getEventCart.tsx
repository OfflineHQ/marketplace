import { delayData } from '@test-utils/functions';
import { EventCart } from '../types';

interface getEventCartProps {
  eventSlug: string;
  organizerSlug: string;
}

export const getEventCart = async ({
  eventSlug,
  organizerSlug,
}: getEventCartProps): Promise<EventCart> => {
  // TODO implement

  const event = await fetch(
    `${process.env.NEXTAUTH_URL}/mocks/event_cart.json`
  );
  await delayData(2000, null);
  console.log('getEventCart', { event });
  return event as EventCart;
};
