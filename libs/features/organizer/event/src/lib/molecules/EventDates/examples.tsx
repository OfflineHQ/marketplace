import { type EventDatesProps } from './EventDates';
import {
  eventDateLocation1,
  eventDateLocation2,
  eventDateLocation3,
} from '../EventLocations/examples';

export const eventDatesProps: EventDatesProps = {
  eventDateLocations: [eventDateLocation1, eventDateLocation2],
  detailed: false,
};

export const event2DatesProps: EventDatesProps = {
  eventDateLocations: [eventDateLocation3],
  detailed: false,
};
