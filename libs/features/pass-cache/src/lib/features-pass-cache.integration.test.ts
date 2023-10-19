import { PassCache } from './features-pass-cache';

jest.mock('@next/next-auth/user');

describe.skip('PassCache Integration Test', () => {
  let passCache: PassCache;

  beforeEach(() => {
    passCache = new PassCache();
  });
  it('should get passes cart', async () => {
    const passesCart = await passCache.getPassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    expect(passesCart).toEqual({
      eventPasses: [],
      total: 0,
    });
  });
});
