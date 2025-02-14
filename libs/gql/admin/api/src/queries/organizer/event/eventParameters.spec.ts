import { adminSdk } from '@gql/admin/api';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
  updateObjects,
} from '@test-utils/db';

import { addHoursInTimeZone, subHoursInTimeZone } from '@time';
import { toZonedTime } from 'date-fns-tz';

describe('eventParameters integration tests', () => {
  process.env.TZ = 'Europe/London';
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
  });

  beforeEach(async () => {
    await deleteTables(client, ['eventParameters']);
    await applySeeds(client, ['eventParameters']);
  });
  afterAll(async () => {
    await deleteTables(client, ['eventParameters']);
    await client.end();
  });
  afterEach(async () => {
    // await closeConnection();
    jest.resetAllMocks();
  });

  const timeZone = 'Europe/London';
  const currentDate = new Date();

  it('should not access eventParameters not PUBLISHED', async () => {
    const res = await adminSdk.GetEventParameters({
      eventId: 'clocula4d04g40bw1t9zefsuc',
    });
    expect(res.eventParameters.length).toBe(0);
  });
  describe('eventParameters for event with timezone Europe/London, same as the one in test', () => {
    it('should return isOngoing true if event is ongoing', async () => {
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: subHoursInTimeZone(currentDate, 2, timeZone),
          dateEnd: addHoursInTimeZone(currentDate, 2, timeZone),
          dateSaleStart: subHoursInTimeZone(currentDate, 2, timeZone),
          dateSaleEnd: addHoursInTimeZone(currentDate, 2, timeZone),
        },
        { eventId: 'clizzpvidao620buvxit1ynko' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(true);
    });

    it('should return isOngoing false if event is not ongoing', async () => {
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: subHoursInTimeZone(currentDate, 6, timeZone), // 6 hours before
          dateEnd: subHoursInTimeZone(currentDate, 1, timeZone), // 1 hour before
          dateSaleStart: subHoursInTimeZone(currentDate, 2, timeZone), // 2 hours before
          dateSaleEnd: subHoursInTimeZone(currentDate, 1, timeZone), // 1 hour before
        },
        { eventId: 'clizzpvidao620buvxit1ynko' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(false);
    });

    it('should return isSaleOngoing true if sale is ongoing', async () => {
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: subHoursInTimeZone(currentDate, 2, timeZone), // 2 hours before
          dateEnd: addHoursInTimeZone(currentDate, 2, timeZone), // 2 hours after
          dateSaleStart: subHoursInTimeZone(currentDate, 1, timeZone), // 1 hour before
          dateSaleEnd: addHoursInTimeZone(currentDate, 1, timeZone), // 1 hour after
        },
        { eventId: 'clizzpvidao620buvxit1ynko' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(true);
    });

    it('should return isSaleOngoing false if sale is not ongoing', async () => {
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: subHoursInTimeZone(currentDate, 2, timeZone), // 2 hours before
          dateEnd: addHoursInTimeZone(currentDate, 2, timeZone), // 2 hours after
          dateSaleStart: subHoursInTimeZone(currentDate, 4, timeZone), // 4 hours before
          dateSaleEnd: subHoursInTimeZone(currentDate, 1, timeZone), // 1 hour before
        },
        { eventId: 'clizzpvidao620buvxit1ynko' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(false);
    });
  });

  describe('eventParameters for event with timezone America/New_York, different from the one in test Europe/London', () => {
    // Adjust for the timezone difference between New York and London
    const timezoneOffset = 1000 * 60 * 60 * 5; // 5 hours
    it('should return isOngoing true if event is ongoing', async () => {
      const currentDate = toZonedTime(new Date(), 'Europe/London');
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: new Date(
            currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour before
          dateEnd: new Date(
            currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour after
          dateSaleStart: new Date(
            currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours before
          dateSaleEnd: new Date(
            currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours after
        },
        { eventId: 'fake-event-1' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(true);
    });

    it('should return isOngoing false if event is not ongoing', async () => {
      const currentDate = toZonedTime(new Date(), 'Europe/London');
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: new Date(
            currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour after
          dateEnd: new Date(
            currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours after
          dateSaleStart: new Date(
            currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours before
          dateSaleEnd: new Date(
            currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour before
        },
        { eventId: 'fake-event-1' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(false);
    });

    it('should return isSaleOngoing true if sale is ongoing', async () => {
      const currentDate = toZonedTime(new Date(), 'Europe/London');
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: new Date(
            currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours before
          dateEnd: new Date(
            currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours after
          dateSaleStart: new Date(
            currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour before
          dateSaleEnd: new Date(
            currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour after
        },
        { eventId: 'fake-event-1' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(true);
    });

    it('should return isSaleOngoing false if sale is not ongoing', async () => {
      const currentDate = toZonedTime(new Date(), 'Europe/London');
      await updateObjects(
        client,
        'eventParameters',
        {
          dateStart: new Date(
            currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours before
          dateEnd: new Date(
            currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours after
          dateSaleStart: new Date(
            currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
          ), // 1 hour after
          dateSaleEnd: new Date(
            currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
          ), // 2 hours after
        },
        { eventId: 'fake-event-1' },
      );
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(false);
    });
  });
});
