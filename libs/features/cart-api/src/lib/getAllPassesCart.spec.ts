import { UserPassPendingOrder } from '@features/cart-types';
import { PassCache } from '@features/pass-cache';
import { getAllPassesCart } from './getAllPassesCart';

jest.mock('@features/pass-cache');

describe('getAllPassesCart', () => {
  const passCache = new PassCache(); // Create a new instance of PassCache

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all passes cart from userPassPendingOrders', async () => {
    const userPassPendingOrders: UserPassPendingOrder[] = [
      {
        id: '1',
        quantity: 1,
        created_at: new Date(),
        eventPass: {
          event: {
            organizer: { slug: 'organizer1' },
            slug: 'event1',
          },
        },
      },
    ];

    const result = await getAllPassesCart(passCache, userPassPendingOrders);

    expect(result).toEqual({
      organizer1: {
        event1: [userPassPendingOrders[0]],
      },
    });
  });

  it('should return all passes cart from passCache if userPassPendingOrders is not provided', async () => {
    const allPassesCart = { organizer1: { event1: [] } };
    passCache.getAllPassesCart = jest.fn().mockResolvedValue(allPassesCart);

    const result = await getAllPassesCart(passCache);

    expect(result).toEqual(allPassesCart);
    expect(passCache.getAllPassesCart).toHaveBeenCalled();
  });
});
