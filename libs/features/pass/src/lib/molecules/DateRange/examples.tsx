import { DateRange, type DateRangeProps } from './DateRange';
import DateRangeClient from './DateRangeClient';

export const datesParis = {
  dateStart: '2021-01-01T21:00:00.000',
  dateEnd: '2021-01-03T12:00:00.000',
  timezone: 'Europe/Paris',
};

export const datesNewYork = {
  dateStart: '2021-02-18T12:00:00.000',
  dateEnd: '2021-01-19T12:00:00.000',
  timezone: 'America/New_York',
};

export const dateRangeProps = {
  ...datesParis,
} satisfies DateRangeProps;

export const dateRangeProps2 = {
  ...datesNewYork,
} satisfies DateRangeProps;

export const DateRangeExample = (dateRangeProps) => (
  <DateRangeClient
    {...dateRangeProps}
    fromText="From"
    toText="To"
    inYourTimezoneText="In your own time zone"
  />
);
