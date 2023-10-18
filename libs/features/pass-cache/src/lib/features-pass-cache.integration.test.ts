import { getUnauthenticatedUserCookie } from '@next/next-auth/user';
import { PassCache } from './features-pass-cache';

jest.mock('@next/next-auth/user');

describe.skip('PassCache Integration Test', () => {
  let passCache: PassCache;

  beforeEach(() => {
    passCache = new PassCache();
  });

  it('should get, set, and delete pass cart', async () => {
    const userId = 'test-user-id';
    const passCart = { id: 'test-pass-cart-id', amount: 1 };
    (getUnauthenticatedUserCookie as jest.Mock).mockReturnValue(userId);

    await passCache.setPassCart(passCart);
    let result = await passCache.getPassCart();
    expect(result).toEqual(passCart);

    await passCache.deletePassCart();
    result = await passCache.getPassCart();
    expect(result).toBeNull();
  });
});
