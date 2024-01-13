import {
  SeedTypeMap,
  applySeeds,
  createDbClient,
  deleteTables,
  insertObjects,
  updateObjects,
  type PgClient,
} from '@test-utils/db';
import { adminSdk } from '@gql/admin/api';
import { accounts } from '@test-utils/gql';
import handler from './handlePendingOrders';

describe('Cron job - handlePendingOrders', () => {
  let client: PgClient;
  const orderAlphaUserEventPass1 = {
    id: '93f15613-850d-43f0-a6a8-67f644f7ff4f',
    eventPassId: 'clj8raobj7g8l0aw3bfw6dny4',
    quantity: 2,
    accountId: accounts.alpha_user.id,
  };
  const orderAlphaUserEventPass2 = {
    id: 'ab902650-e8ee-46bb-b635-d529fbda5db8',
    eventPassId: 'clkr1vpdhnqg80bw2ckil7ytq',
    quantity: 1,
    accountId: accounts.alpha_user.id,
  };
  const orderBetaUserEventPassSaleNotOngoing = {
    id: 'f1d2a2d6-9b48-4a7e-9a8f-7f4b5b5d6d6d',
    eventPassId: 'cloculueqmluk0aujj0ridfwv',
    quantity: 1,
    accountId: accounts.beta_user.id,
  };

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, [
      'account',
      'passAmount',
      'pendingOrder',
      'eventParameters',
    ]);
    await applySeeds(client, ['account', 'passAmount', 'eventParameters']);
    // Here force the event to be isSaleOnGoing = true
    const currentDate = new Date();
    await updateObjects(
      client,
      'eventParameters',
      {
        timezone: 'UTC',
        dateSaleStart: new Date(currentDate.getTime() - 12000 * 60 * 60), // 12 hours before
        dateSaleEnd: new Date(currentDate.getTime() + 12000 * 60 * 60), // 12 hours after
      },
      { eventId: 'clizzpvidao620buvxit1ynko' },
    );
  });

  afterAll(async () => {
    await deleteTables(client, [
      'account',
      'passAmount',
      'pendingOrder',
      'eventParameters',
    ]);
    await client.end();
  });

  beforeEach(async () => {
    await deleteTables(client, ['pendingOrder']);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should delete expired pendingOrder and return the accounts to notify', async () => {
    const pendingOrders = [
      {
        ...orderAlphaUserEventPass1,
        created_at: '2023-07-19 12:59:00Z', // Adjusted to a time that makes it eligible for deletion
      },
      {
        ...orderAlphaUserEventPass2,
        created_at: '2023-07-19 15:59:00Z', // More recent time, should not be deleted
      },
      // ... other orders ...
    ] satisfies SeedTypeMap['pendingOrder'][];
    await insertObjects(client, 'pendingOrder', pendingOrders);
    // set the current time to 2023-07-19 12:58:46 + 14400 seconds = 4 hours => 2023-07-19 16:59:00
    const date = new Date(Date.UTC(2023, 6, 19, 16, 59)); // 2023-07-19 16:59:00 have to set it to 6 for July because months are 0-indexed
    jest.setSystemTime(date);
    // Run the cron job handler
    const res = await handler();
    const resJson = await res.json();
    // The orders with id '93f15613-850d-43f0-a6a8-67f644f7ff4f' should be deleted as they it's expired
    // The account alpha_user should be notified
    expect(resJson).toEqual({
      accountsToNotify: [
        {
          address: accounts.alpha_user.address,
          email: accounts.alpha_user.email,
          eventPassIds: ['clj8raobj7g8l0aw3bfw6dny4'],
          packIds: [],
        },
      ],
      ordersToDelete: ['93f15613-850d-43f0-a6a8-67f644f7ff4f'],
    });
  });
  it('should not delete any orders when none are eligible for deletion', async () => {
    const date = new Date(Date.UTC(2023, 6, 19, 12, 0)); // Current mock time
    jest.setSystemTime(date);

    const recentOrders = [
      {
        ...orderAlphaUserEventPass1,
        created_at: new Date(date.getTime() - 500).toISOString(), // Very recent order
      },
      {
        ...orderAlphaUserEventPass2,
        created_at: new Date(date.getTime() - 300).toISOString(), // Very recent order
      },
    ];

    await insertObjects(client, 'pendingOrder', recentOrders);

    const res = await handler();
    const resJson = await res.json();

    expect(resJson).toEqual({
      accountsToNotify: [],
      ordersToDelete: [],
    });
  });
  it('should correctly handle orders with different event pass sale statuses', async () => {
    // Mock data for orders linked to different event passes
    const mixedOrders = [
      {
        ...orderAlphaUserEventPass1,
        created_at: '2023-07-19 12:59:00Z', // Adjusted to a time that makes it eligible for deletion
      },
      {
        ...orderAlphaUserEventPass2,
        created_at: '2023-07-19 15:59:00Z', // More recent time, should not be deleted
      },
      {
        ...orderBetaUserEventPassSaleNotOngoing,
        created_at: '2023-07-19 12:59:00Z', // More recent time, should not be deleted
      },
    ];

    await insertObjects(client, 'pendingOrder', mixedOrders);
    const date = new Date(Date.UTC(2023, 6, 19, 16, 59)); // Mock time
    jest.setSystemTime(date);

    const res = await handler();
    const resJson = await res.json();

    expect(resJson).toEqual({
      accountsToNotify: [
        {
          address: accounts.alpha_user.address,
          email: accounts.alpha_user.email,
          eventPassIds: ['clj8raobj7g8l0aw3bfw6dny4'],
          packIds: [],
        },
        {
          address: accounts.beta_user.address,
          email: null,
          eventPassIds: ['cloculueqmluk0aujj0ridfwv'],
          packIds: [],
        },
      ],
      ordersToDelete: [
        '93f15613-850d-43f0-a6a8-67f644f7ff4f',
        'f1d2a2d6-9b48-4a7e-9a8f-7f4b5b5d6d6d',
      ],
    });
  });
  it('should handle errors during order processing', async () => {
    // Mock an error scenario, for example, by mocking adminSdk to throw an error
    jest.spyOn(adminSdk, 'GetPendingOrders').mockImplementation(() => {
      throw new Error('Database error');
    });

    const res = await handler();
    expect(res.status).toEqual(500);
  });
});
