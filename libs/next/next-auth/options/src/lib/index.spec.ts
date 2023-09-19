import { isBackOffice } from '@utils';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { createOptions } from './';

jest.mock('@next/siwe/provider', () => ({
  SiweProvider: jest.fn(() => ({})),
}));

jest.mock('@utils', () => ({
  ...jest.requireActual('@utils'),
  isBackOffice: jest.fn(),
}));

jest.mock('@features/account/api', () => ({
  ...jest.requireActual('@features/account/api'),
  getAccount: jest.fn(),
}));

describe('createOptions callbacks', () => {
  const mockToken: JWT = {
    exp: 1615680311,
    iat: 1615680311,
    sub: 'user-xyz',
    user: {
      id: 'dummy',
      address: 'user-xyz',
      email: '',
    },
  };

  const mockUser: User = {
    id: 'dummy',
    address: 'user-xyz',
    email: 'user@test.com',
    name: 'Test User',
  };

  const mockReq: NextRequest = {
    headers: {},
    query: {},
    body: {},
    method: 'GET',
    url: '',
    cookies: {},
  } as unknown as NextRequest;

  beforeEach(() => {
    (isBackOffice as jest.Mock).mockReturnValue(false);
  });
  it('should add access, provider, providerType, and role fields to token if user and account are provided', async () => {
    const result = await createOptions(mockReq).callbacks.jwt({
      token: mockToken,
      user: mockUser,
      account: {
        providerAccountId: 'dummy',
        type: 'credentials',
        provider: 'credentials',
      },
    });

    expect(result).toEqual({
      user: mockUser,
      provider: 'credentials',
      providerType: 'credentials',
      role: 'user',
      access: {
        pathPermissions: [
          {
            match: {
              path: `/local/users/${mockUser.address}`,
              scope: 'Grandchildren+',
            },
            permissions: {
              read: {
                file: {
                  downloadFile: ['*'],
                  getFileDetails: true,
                },
              },
              write: {
                file: {
                  createFile: false,
                  deleteFile: false,
                  overwriteFile: false,
                },
              },
            },
          },
        ],
      },
    });
  });

  it('should add access, provider, providerType, and role fields to token if user and account are provided and isBackOffice is true', async () => {
    const mockOrganizer = { ...mockUser, organizerId: 'organizer-xyz' };
    // Mock the isBackOffice function to return true
    (isBackOffice as jest.Mock).mockReturnValue(true);
    const result = await createOptions(mockReq).callbacks.jwt({
      token: mockToken,
      user: mockOrganizer,
      account: {
        providerAccountId: 'dummy',
        type: 'credentials',
        provider: 'credentials',
      },
    });

    expect(result).toEqual({
      user: mockOrganizer,
      provider: 'credentials',
      providerType: 'credentials',
      role: 'organizer', // role should be 'organizer' when isBackOffice is true
      access: {
        pathPermissions: [
          {
            match: {
              path: `/${process.env.UPLOAD_PATH_PREFIX}/organizers/${mockOrganizer.organizerId}`,
              scope: 'Grandchildren+',
            },
            permissions: {
              read: {
                file: {
                  downloadFile: ['*'],
                  getFileDetails: true,
                },
              },
              write: {
                file: {
                  createFile: true,
                  deleteFile: true,
                  overwriteFile: true,
                },
              },
            },
          },
        ],
      },
    });
  });

  it('should not modify token if user and account are not provided', async () => {
    const result = await createOptions(mockReq).callbacks.jwt({
      token: mockToken,
      user: {} as User,
      account: null,
    });

    expect(result).toEqual(mockToken);
  });
});
