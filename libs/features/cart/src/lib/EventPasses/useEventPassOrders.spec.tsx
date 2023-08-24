import { renderHook, waitFor } from '@testing-library/react';
import { useEventPassOrders } from './useEventPassOrders';
import { usersJwt } from '@test-utils/gql';
import { QueryClientProviderForTest } from '@test-utils/react-query';
import { Locale } from '@gql/shared/types';
import {
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
  applySeeds,
} from '@test-utils/db';
import { act } from 'react-dom/test-utils';

const mockUpdatePassCart = jest.fn();
const mockDeletePassesCart = jest.fn();
const mockDeletePassCart = jest.fn();
jest.mock('@features/organizer/event/store', () => ({
  usePassPurchaseStore: () => ({
    updatePassCart: mockUpdatePassCart,
    deletePassesCart: mockDeletePassesCart,
    deletePassCart: mockDeletePassCart,
  }),
}));

const mockInsertOrder = jest.fn();
const mockDeleteOrder = jest.fn();
jest.mock('@gql/user/react-query', () => ({
  ...jest.requireActual('@gql/user/react-query'),
  useInsertEventPassPendingOrdersMutation: () => ({
    mutateAsync: mockInsertOrder,
  }),
  useDeleteEventPassPendingOrdersMutation: () => ({
    mutateAsync: mockDeleteOrder,
  }),
  useGetEventWithPassesQuery: jest.fn(() => ({
    data: {
      event: {
        id: 'test-event-id',
        slug: 'test-event',
        title: 'Test Event',
        heroImage: {
          url: 'http://test-event.com/hero.jpg',
        },
        organizer: {
          id: 'test-organizer-id',
          slug: 'test-organizer',
          name: 'Test Organizer',
          image: {
            url: 'http://test-organizer.com/image.jpg',
          },
        },
        eventPasses: [
          {
            id: 'fake-event-pass-1',
            name: 'Fake Event Pass 1',
            description: 'This is a fake event pass',
            eventPassPricing: {
              priceAmount: 120000,
              priceCurrency: 'EUR',
            },
          },
          {
            id: 'fake-event-pass-2',
            name: 'Fake Event Pass 2',
            description: 'This is a fake event pass',
            eventPassPricing: {
              priceAmount: 130000,
              priceCurrency: 'EUR',
            },
          },
        ],
      },
    },
  })),
}));

global.window = Object.create(window);
describe('useEventPassOrders', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['account']);
    await seedDb(client, 'account');
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
    await deleteTables(client, ['eventPassPendingOrder', 'eventPassPricing']);
    await applySeeds(client, ['eventPassPricing', 'eventPassPendingOrder']);
    mockUpdatePassCart.mockClear();
    mockDeletePassesCart.mockClear();
    mockInsertOrder.mockClear();
    mockDeleteOrder.mockClear();
    mockDeletePassCart.mockClear();
  });
  afterEach(() => {
    delete window.jwtTestToken;
  });
  it('Should retrieve existing order for an event from database', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
      expect(
        result.current.ordersData?.eventPassPendingOrder[0].eventPassId
      ).toBe('fake-event-pass-1');
    });
  });
  it('Should retrieve multiple existing order for an event from database', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.alpha_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(2);
    });
  });
  it("Should retrieve existing orders for an event from database and merge with local passes if it doesn't exist", async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
    });
    await act(async () => {
      await result.current.upsertOrders([]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(1);
      expect(mockUpdatePassCart).toHaveBeenCalledWith({
        organizerSlug: 'test-organizer',
        eventSlug: 'test-event',
        pass: {
          id: 'fake-event-pass-1',
          amount: 12,
        },
      });
    });
  });
  it('Should retrieve existing orders for an event from database and update with local quantity if different', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
    });
    await act(async () => {
      await result.current.upsertOrders([
        {
          id: 'fake-event-pass-1',
          amount: 1,
        },
      ]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(0);
      expect(mockDeleteOrder).toHaveBeenCalledTimes(1);
      expect(mockDeleteOrder).toHaveBeenCalledWith({
        eventPassIds: ['fake-event-pass-1'],
      });
      expect(mockInsertOrder).toHaveBeenCalledTimes(1);
      expect(mockInsertOrder).toHaveBeenCalledWith({
        objects: [
          {
            eventPassId: 'fake-event-pass-1',
            quantity: 1,
          },
        ],
      });
    });
  });
  it('Should insert an order from local cart that is not present in database', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
    });
    await act(async () => {
      await result.current.upsertOrders([
        {
          id: 'fake-event-pass-1',
          amount: 12,
        },
        {
          id: 'fake-event-pass-2',
          amount: 1,
        },
      ]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(0);
      expect(mockDeleteOrder).toHaveBeenCalledTimes(0);
      expect(mockInsertOrder).toHaveBeenCalledTimes(1);
      expect(mockInsertOrder).toHaveBeenCalledWith({
        objects: [
          {
            eventPassId: 'fake-event-pass-2',
            quantity: 1,
          },
        ],
      });
    });
  });
  it('Should insert an order form local storage that is not present in database and update the local storage with an order from database that was not present locally', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
    });
    await act(async () => {
      await result.current.upsertOrders([
        {
          id: 'fake-event-pass-2',
          amount: 1,
        },
      ]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(1);
      expect(mockUpdatePassCart).toHaveBeenCalledWith({
        organizerSlug: 'test-organizer',
        eventSlug: 'test-event',
        pass: {
          id: 'fake-event-pass-1',
          amount: 12,
        },
      });
      expect(mockDeleteOrder).toHaveBeenCalledTimes(0);
      expect(mockInsertOrder).toHaveBeenCalledTimes(1);
      expect(mockInsertOrder).toHaveBeenCalledWith({
        objects: [
          {
            eventPassId: 'fake-event-pass-2',
            quantity: 1,
          },
        ],
      });
    });
  });

  it("Should delete existing pending order if local storage order get an amount of 0 and also delete this local storage order when it's done", async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.alpha_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(2);
    });
    await act(async () => {
      await result.current.upsertOrders([
        {
          id: 'fake-event-pass-1',
          amount: 2,
        },
        {
          id: 'fake-event-pass-2',
          amount: 0,
        },
      ]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(0);
      expect(mockDeleteOrder).toHaveBeenCalledTimes(1);
      expect(mockDeleteOrder).toHaveBeenCalledWith({
        eventPassIds: ['fake-event-pass-2'],
      });
      expect(mockInsertOrder).toHaveBeenCalledTimes(0);
      expect(mockDeletePassCart).toHaveBeenCalledTimes(1);
      expect(mockDeletePassCart).toHaveBeenCalledWith({
        organizerSlug: 'test-organizer',
        eventSlug: 'test-event',
        eventPassId: 'fake-event-pass-2',
      });
    });
  });

  it("Should delete local storage order if get an amount of 0 but not delete order from db if doesn't exist", async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
    });
    await act(async () => {
      await result.current.upsertOrders([
        {
          id: 'fake-event-pass-1',
          amount: 12,
        },
        {
          id: 'fake-event-pass-2',
          amount: 0,
        },
      ]);
      expect(mockUpdatePassCart).toHaveBeenCalledTimes(0);
      expect(mockDeleteOrder).toHaveBeenCalledTimes(0);
      expect(mockInsertOrder).toHaveBeenCalledTimes(0);
      expect(mockDeletePassCart).toHaveBeenCalledTimes(1);
      expect(mockDeletePassCart).toHaveBeenCalledWith({
        organizerSlug: 'test-organizer',
        eventSlug: 'test-event',
        eventPassId: 'fake-event-pass-2',
      });
    });
  });

  it('Should delete orders correctly from database but not local storage', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.alpha_user,
      configurable: true,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(2);
    });
    await act(async () => {
      await result.current.deleteOrders([
        {
          id: 'fake-event-pass-1',
          amount: 12,
        },
        {
          id: 'fake-event-pass-2',
          amount: 12,
        },
      ]);
      expect(mockDeleteOrder).toHaveBeenCalledTimes(1);
      expect(mockDeleteOrder).toHaveBeenCalledWith({
        eventPassIds: ['fake-event-pass-1', 'fake-event-pass-2'],
      });
      expect(mockDeletePassesCart).toHaveBeenCalledTimes(0);
    });
  });
});
