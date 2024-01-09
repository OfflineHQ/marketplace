import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
} from '@test-utils/db';
import { adminSdk } from '../../../generated';

async function setEventDates(
  client: PgClient,
  eventId: string,
  dates: { start: Date; end: Date; saleStart: Date; saleEnd: Date },
) {
  await client.query(
    `
    UPDATE public."eventParameters"
    SET "dateStart" = $1, "dateEnd" = $2, "dateSaleStart" = $3, "dateSaleEnd" = $4, "status" = 'PUBLISHED'
    WHERE "eventId" = $5
  `,
    [dates.start, dates.end, dates.saleStart, dates.saleEnd, eventId],
  );
}

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

  it('should not access eventParameters not PUBLISHED', async () => {
    const res = await adminSdk.GetEventParameters({
      eventId: 'clizzpvidao620buvxit1ynko',
    });
    expect(res.eventParameters.length).toBe(0);
  });
  describe('eventParameters for event with timezone Europe/London, same as the one in test', () => {
    it('should return isOngoing true if event is ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'clizzpvidao620buvxit1ynko', {
        start: new Date(currentDate.getTime() - 1000 * 60 * 60), // 1 hour before
        end: new Date(currentDate.getTime() + 1000 * 60 * 60), // 1 hour after
        saleStart: new Date(currentDate.getTime() - 2000 * 60 * 60), // 2 hours before
        saleEnd: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(true);
    });

    it('should return isOngoing false if event is not ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'clizzpvidao620buvxit1ynko', {
        start: new Date(currentDate.getTime() + 1000 * 60 * 60), // 1 hour after
        end: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
        saleStart: new Date(currentDate.getTime() - 2000 * 60 * 60), // 2 hours before
        saleEnd: new Date(currentDate.getTime() - 1000 * 60 * 60), // 1 hour before
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(false);
    });

    it('should return isSaleOngoing true if sale is ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'clizzpvidao620buvxit1ynko', {
        start: new Date(currentDate.getTime() - 2000 * 60 * 60), // 2 hours before
        end: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
        saleStart: new Date(currentDate.getTime() - 1000 * 60 * 60), // 1 hour before
        saleEnd: new Date(currentDate.getTime() + 1000 * 60 * 60), // 1 hour after
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'clizzpvidao620buvxit1ynko',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(true);
    });

    it('should return isSaleOngoing false if sale is not ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'clizzpvidao620buvxit1ynko', {
        start: new Date(currentDate.getTime() - 2000 * 60 * 60), // 2 hours before
        end: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
        saleStart: new Date(currentDate.getTime() + 1000 * 60 * 60), // 1 hour after
        saleEnd: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
      });
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
      const currentDate = new Date();
      await setEventDates(client, 'fake-event-1', {
        start: new Date(
          currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour before
        end: new Date(
          currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour after
        saleStart: new Date(
          currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours before
        saleEnd: new Date(
          currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours after
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(true);
    });

    it('should return isOngoing false if event is not ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'fake-event-1', {
        start: new Date(
          currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour after
        end: new Date(
          currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours after
        saleStart: new Date(
          currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours before
        saleEnd: new Date(
          currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour before
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isOngoing).toBe(false);
    });

    it('should return isSaleOngoing true if sale is ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'fake-event-1', {
        start: new Date(
          currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours before
        end: new Date(
          currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours after
        saleStart: new Date(
          currentDate.getTime() - (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour before
        saleEnd: new Date(
          currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour after
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(true);
    });

    it('should return isSaleOngoing false if sale is not ongoing', async () => {
      const currentDate = new Date();
      await setEventDates(client, 'fake-event-1', {
        start: new Date(
          currentDate.getTime() - (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours before
        end: new Date(
          currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours after
        saleStart: new Date(
          currentDate.getTime() + (1000 * 60 * 60 + timezoneOffset),
        ), // 1 hour after
        saleEnd: new Date(
          currentDate.getTime() + (2000 * 60 * 60 + timezoneOffset),
        ), // 2 hours after
      });
      const res = await adminSdk.GetEventParameters({
        eventId: 'fake-event-1',
      });
      const event = res.eventParameters[0];
      expect(event.isSaleOngoing).toBe(false);
    });
  });
});
