import { rtfProps, rtfWithImageProps } from '@next/hygraph/examples';
import { type EventDetailsProps } from './EventDetails';

export const eventDetailsProps: EventDetailsProps = {
  description: {
    json: rtfWithImageProps.content,
  },
};

export const eventDetails2Props: EventDetailsProps = {
  description: {
    json: rtfProps.content,
  },
};
