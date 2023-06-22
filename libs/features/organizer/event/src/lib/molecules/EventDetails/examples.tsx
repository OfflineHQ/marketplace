import { type EventDetailsProps } from './EventDetails';
import { rtfWithImageProps, rtfProps } from '@next/hygraph/examples';

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
