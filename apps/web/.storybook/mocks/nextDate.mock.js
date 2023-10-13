import { DateRange } from '../../../../libs/next/date/src/lib/DateRange/DateRange';
import { EventDates } from '../../../../libs/next/date/src/lib/EventDates/EventDates';

async function DateRangeServer(props) {
  return <DateRange {...props} />;
}

async function EventDatesServer(props) {
  return <EventDates {...props} />;
}

export { DateRange, DateRangeServer, EventDates, EventDatesServer };
