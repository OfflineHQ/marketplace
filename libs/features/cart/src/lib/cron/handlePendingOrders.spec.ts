import handler from './handlePendingOrders';
import {
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
  applySeeds,
} from '@test-utils/db';

describe('Cron job - handlePendingOrders', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, [
      'account',
      'eventPassPendingOrder',
      'eventPassPricing',
    ]);
    await applySeeds(client, ['account', 'eventPassPricing']);
  });

  afterAll(async () => {
    await deleteTables(client, [
      'account',
      'eventPassPendingOrder',
      'eventPassPricing',
    ]);
    await client.end();
  });

  beforeEach(async () => {
    await deleteTables(client, ['eventPassPendingOrder']);
    await seedDb(client, 'eventPassPendingOrder');
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should delete expired eventPassPendingOrders and return the accounts to notify', async () => {
    // Mock the current time
    // set the current time to 2023-07-19 12:58:46 + 14400 seconds = 4 hours => 2023-07-19 16:59:00
    const date = new Date(Date.UTC(2023, 6, 19, 16, 59)); // 2023-07-19 16:59:00 have to set it to 6 for July because months are 0-indexed
    jest.setSystemTime(date);
    // Run the cron job handler
    const res = await handler();
    const resJson = await res.json();
    // The orders with ids 'd4951f86-1a8f-410a-bbc1-607f1c7933b9' and 'c44e9122-7818-47c2-8818-508121c9843d' should be deleted as they are expired
    // The account with address '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D' should be notified
    expect(resJson).toEqual({
      accountsToNotify: [
        {
          address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          email: 'alpha_user@test.io',
          eventPassIds: ['fake-event-pass-1', 'fake-event-pass-2'],
        },
      ],
      ordersToDelete: [
        'd4951f86-1a8f-410a-bbc1-607f1c7933b9',
        'c44e9122-7818-47c2-8818-508121c9843d',
      ],
    });
  });

  it('should delete all eventPassPendingOrders and return all the accounts to notify if date pass the last order', async () => {
    // Mock the current time
    // set the current time to 2023-07-19 12:58:46 + 14400 seconds = 4 hours => 2023-07-19 16:59:00
    const date = new Date(Date.UTC(2023, 6, 19, 17)); // 2023-07-19 16:59:00 have to set it to 6 for July because months are 0-indexed
    jest.setSystemTime(date);
    // Run the cron job handler
    const res = await handler();
    const resJson = await res.json();
    // The orders with ids 'd4951f86-1a8f-410a-bbc1-607f1c7933b9' and 'c44e9122-7818-47c2-8818-508121c9843d' should be deleted as they are expired
    // The account with address '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D' should be notified
    expect(resJson).toEqual({
      accountsToNotify: [
        {
          address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          email: 'alpha_user@test.io',
          eventPassIds: ['fake-event-pass-1', 'fake-event-pass-2'],
        },
        {
          address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
          email: 'beta_user@test.io',
          eventPassIds: ['fake-event-pass-1'],
        },
      ],
      ordersToDelete: [
        'd4951f86-1a8f-410a-bbc1-607f1c7933b9',
        'c44e9122-7818-47c2-8818-508121c9843d',
        'd3ce4e64-f405-4b98-bcb9-e6b0222ad60a',
      ],
    });
  });
});
