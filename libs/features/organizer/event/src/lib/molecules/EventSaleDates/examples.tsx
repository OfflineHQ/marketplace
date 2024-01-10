import { EventParameters } from '@features/organizer/event-types';

export const eventParametersSaleNotStarted = {
  dateSaleStart: '2023-06-05T04:00:00',
  dateSaleEnd: '2023-06-05T15:00:00',
  timezone: 'Europe/Paris',
} satisfies EventParameters;

export const eventParametersSaleOngoing = {
  dateSaleStart: '2023-06-05T04:00:00',
  dateSaleEnd: '2023-06-05T15:00:00',
  timezone: 'America/New_York',
} satisfies EventParameters;

export const eventParametersSaleEnded = {
  dateSaleStart: '2023-06-04T04:00:00',
  dateSaleEnd: '2023-06-05T00:00:00',
  timezone: 'Europe/Paris',
} satisfies EventParameters;
