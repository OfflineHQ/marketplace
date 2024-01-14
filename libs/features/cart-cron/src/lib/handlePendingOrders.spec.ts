import { adminSdk } from '@gql/admin/api';
import {
  filterOrdersToDelete,
  isOrderPastDeletionTime,
  prepareAccountsToNotify,
} from './handlePendingOrders'; // Adjust the import path as needed

jest.mock('@gql/admin/api');
const mockOrders = [
  {
    id: 'order1',
    created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    eventPassId: 'eventPass1',
    packId: null,
    account: { email: 'test1@example.com', address: 'address1' },
    passAmount: { timeBeforeDelete: 3600 }, // 1 hour
  },
  {
    id: 'order2',
    created_at: new Date('2024-01-02T00:00:00Z').toISOString(),
    eventPassId: 'eventPass2',
    packId: null,
    account: { email: 'test2@example.com', address: 'address2' },
    passAmount: { timeBeforeDelete: 7200 }, // 2 hours
  },
];

const orderWithSameEventPassIdAsOrder1 = {
  id: 'order3',
  created_at: new Date('2024-01-01T00:30:00Z').toISOString(),
  eventPassId: 'eventPass1',
  packId: null,
  account: { email: 'test2@example.com', address: 'address1' },
  passAmount: { timeBeforeDelete: 3600 }, // 1 hour
};

const mockResponseEventParameters = {
  eventPasses: [
    { id: 'eventPass1', event: { eventParameters: { isSaleOngoing: false } } },
    { id: 'eventPass2', event: { eventParameters: { isSaleOngoing: true } } },
  ],
};

describe('handlePendingOrders unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('isOrderPastDeletionTime', () => {
    it('should return true if the order is past the deletion time', () => {
      const currentTime = new Date('2024-01-01T02:00:00Z').getTime() / 1000; // 2 hours after the creation of order1
      const result = isOrderPastDeletionTime(mockOrders[0], currentTime);
      expect(result).toBe(true);
    });

    it('should return false if the order is not past the deletion time', () => {
      const currentTime = new Date('2024-01-02T01:00:00Z').getTime() / 1000; // 1 hour after the creation of order2
      const result = isOrderPastDeletionTime(mockOrders[1], currentTime);
      expect(result).toBe(false);
    });

    it('should return true at the exact deletion time', () => {
      const orderCreationTime =
        new Date('2024-01-01T00:00:00Z').getTime() / 1000;
      const timeBeforeDelete = 3600; // 1 hour
      const deletionTime = orderCreationTime + timeBeforeDelete;
      const result = isOrderPastDeletionTime(mockOrders[0], deletionTime);
      expect(result).toBe(true);
    });

    it('should handle orders without passAmount or packAmount', () => {
      const orderWithoutTimeBeforeDelete = {
        ...mockOrders[0],
        passAmount: null,
        packAmount: null,
      };
      const currentTime = new Date('2024-01-01T05:00:00Z').getTime() / 1000; // 5 hours after creation
      const result = isOrderPastDeletionTime(
        orderWithoutTimeBeforeDelete,
        currentTime,
      );
      expect(result).toBe(true); // Default 4 hours should apply
    });

    it('should return false if the order is exactly on the deletion time boundary', () => {
      const orderCreationTime =
        new Date('2024-01-02T00:00:00Z').getTime() / 1000;
      const timeBeforeDelete = 7200; // 2 hours
      const deletionTime = orderCreationTime + timeBeforeDelete - 1; // 1 second before deletion time
      const result = isOrderPastDeletionTime(mockOrders[1], deletionTime);
      expect(result).toBe(false);
    });
  });
  describe('filterOrdersToDelete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      adminSdk.GetEventParametersFromEventPassIds = jest
        .fn()
        .mockResolvedValue(mockResponseEventParameters);
    });

    it('should not delete any orders if none meet the criteria', async () => {
      adminSdk.GetEventParametersFromEventPassIds = jest
        .fn()
        .mockResolvedValueOnce({
          eventPasses: [
            {
              id: 'eventPass1',
              event: { eventParameters: { isSaleOngoing: true } },
            },
            {
              id: 'eventPass2',
              event: { eventParameters: { isSaleOngoing: true } },
            },
            // ... more event passes ...
          ],
        });
      const currentTime = new Date('2024-01-01T00:00:00Z').getTime() / 1000; // Before the deletion time of both orders
      const expectedOrdersToDelete = [];
      const result = await filterOrdersToDelete(mockOrders, currentTime);
      expect(result).toEqual(expectedOrdersToDelete);
    });

    it('should delete only orders with isSaleOngoing false and past deletion time', async () => {
      const currentTime = new Date('2024-01-01T02:00:00Z').getTime() / 1000; // After the deletion time of order1 but before order2
      const expectedOrdersToDelete = ['order1']; // Only 'order1' meets both criteria
      const result = await filterOrdersToDelete(mockOrders, currentTime);
      expect(result).toEqual(expectedOrdersToDelete);
    });

    it('should include orders that are past deletion time regardless of sale status', async () => {
      const currentTime = new Date('2024-01-03T00:00:00Z').getTime() / 1000; // After the deletion time of order2

      // Both 'order1' and 'order2' should be marked for deletion at this point
      const expectedOrdersToDelete = ['order1', 'order2'];
      const result = await filterOrdersToDelete(mockOrders, currentTime);

      expect(result).toEqual(expectedOrdersToDelete);
    });

    it('should correctly handle orders with the same eventPassId', async () => {
      const modifiedMockOrders = [
        ...mockOrders,
        orderWithSameEventPassIdAsOrder1,
      ];
      const currentTime = new Date('2024-01-01T02:00:00Z').getTime() / 1000; // After the deletion time of order1 and orderWithSameEventPassIdAsOrder1

      // Both 'order1' and 'orderWithSameEventPassIdAsOrder1' are not on sale and past deletion time
      const expectedOrdersToDelete = ['order1', 'order3'];
      const result = await filterOrdersToDelete(
        modifiedMockOrders,
        currentTime,
      );

      expect(result).toEqual(expectedOrdersToDelete);
    });

    it('should not delete orders with the same eventPassId if sale is ongoing', async () => {
      adminSdk.GetEventParametersFromEventPassIds = jest
        .fn()
        .mockResolvedValueOnce({
          eventPasses: [
            {
              id: 'eventPass1',
              event: { eventParameters: { isSaleOngoing: true } },
            },
            {
              id: 'eventPass2',
              event: { eventParameters: { isSaleOngoing: true } },
            },
            // ... more event passes ...
          ],
        });
      const modifiedMockOrders = [
        ...mockOrders,
        orderWithSameEventPassIdAsOrder1,
      ];
      const currentTime = new Date('2024-01-01T01:00:00Z').getTime() / 1000; // Before the deletion time of orderWithSameEventPassIdAsOrder1

      // 'order1' is not on sale and past deletion time, but 'orderWithSameEventPassIdAsOrder1' is not yet past deletion time
      const expectedOrdersToDelete = ['order1'];
      const result = await filterOrdersToDelete(
        modifiedMockOrders,
        currentTime,
      );

      expect(result).toEqual(expectedOrdersToDelete);
    });
  });
  describe('prepareAccountsToNotify', () => {
    const modifiedMockOrders = [
      ...mockOrders,
      orderWithSameEventPassIdAsOrder1, // Include the additional order
    ];

    it('should prepare notifications for accounts linked to deleted orders', () => {
      const ordersToDelete = ['order1', 'order2']; // Assuming these orders are to be deleted
      const result = prepareAccountsToNotify(
        modifiedMockOrders,
        ordersToDelete,
      );

      // Expected accounts to notify based on mock data
      const expectedAccountsToNotify = {
        address1: {
          address: 'address1',
          email: 'test1@example.com',
          eventPassIds: ['eventPass1'],
          packIds: [],
        },
        address2: {
          address: 'address2',
          email: 'test2@example.com',
          eventPassIds: ['eventPass2'],
          packIds: [],
        },
      };

      expect(result).toEqual(expectedAccountsToNotify);
    });

    it('should handle multiple orders for the same account', () => {
      const ordersToDelete = ['order1', 'order3']; // 'order1' and 'order3' are linked to the same account
      const result = prepareAccountsToNotify(
        modifiedMockOrders,
        ordersToDelete,
      );

      const expectedAccountsToNotify = {
        address1: {
          address: 'address1',
          email: 'test1@example.com',
          eventPassIds: ['eventPass1', 'eventPass1'], // Duplicate eventPassIds are expected as both orders have the same eventPassId
          packIds: [],
        },
      };

      expect(result).toEqual(expectedAccountsToNotify);
    });

    it('should not include accounts for orders not marked for deletion', () => {
      const ordersToDelete = ['order1']; // Only 'order1' is marked for deletion
      const result = prepareAccountsToNotify(
        modifiedMockOrders,
        ordersToDelete,
      );

      const expectedAccountsToNotify = {
        address1: {
          address: 'address1',
          email: 'test1@example.com',
          eventPassIds: ['eventPass1'],
          packIds: [],
        },
        // 'address2' should not be included as 'order2' is not marked for deletion
      };

      expect(result).toEqual(expectedAccountsToNotify);
    });

    // ... any other specific scenarios you want to test ...
  });
});
