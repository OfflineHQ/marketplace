import { NextRequest, NextResponse } from 'next/server';
import middleware from './middleware';

// Mock createMiddleware
jest.mock('next-intl/middleware', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('middleware', () => {
  const redirectSpy = jest.spyOn(NextResponse, 'redirect');
  const rewriteSpy = jest.spyOn(NextResponse, 'rewrite');

  let req;
  let res;

  beforeEach(() => {
    req = {
      cookies: {
        get: jest.fn(),
      },
      nextUrl: {
        pathname: '',
      },
      url: 'http://localhost:8888',
    };
    res = {};
    redirectSpy.mockReset();
    rewriteSpy.mockReset();
    // Reset the mocks before each test
    // createMiddleware.default.mockReset();
  });

  it('should redirect if not authenticated', async () => {
    req.cookies.get.mockReturnValue(null);
    req.nextUrl.pathname = '/en/user';

    await middleware(req);

    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith(new URL('/', req.url));
  });

  it('should redirect if not authenticated on sub route', async () => {
    req.cookies.get.mockReturnValue(null);
    req.nextUrl.pathname = '/en/event/event-slug';

    await middleware(req);

    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith(new URL('/', req.url));
  });

  it('should not redirect if authenticated', async () => {
    req.cookies.get.mockReturnValue('auth_token');
    req.nextUrl.pathname = '/en/user';

    await middleware(req);

    expect(redirectSpy).not.toHaveBeenCalled();
  });

  it('should not redirect if authenticated on sub route', async () => {
    req.cookies.get.mockReturnValue('auth_token');
    req.nextUrl.pathname = '/en/event/event-slug';

    await middleware(req);

    expect(redirectSpy).not.toHaveBeenCalled();
  });

  it('should not redirect if not an auth page', async () => {
    req.cookies.get.mockReturnValue(null);
    req.nextUrl.pathname = '/not_auth_page';

    await middleware(req);

    expect(redirectSpy).not.toHaveBeenCalled();
  });
});
