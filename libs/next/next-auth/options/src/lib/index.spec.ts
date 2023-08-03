import { authOptions } from './index';
import type { JWT } from 'next-auth/jwt';
import type { User } from 'next-auth';

jest.mock('@next/siwe/provider', () => ({
  SiweProvider: jest.fn(() => ({})),
}));

describe('authOptions callbacks', () => {
  const mockToken: JWT = {
    exp: 1615680311,
    iat: 1615680311,
    sub: 'user-xyz',
  };

  const mockUser: User = {
    id: 'dummy',
    address: 'user-xyz',
    email: 'user@test.com',
    name: 'Test User',
  };

  it('should add access, provider, providerType, and role fields to token if user and account are provided', async () => {
    const result = await authOptions.callbacks.jwt({
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
              scope: 'Children',
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
        tagPermissions: {
          write: [''],
        },
      },
    });
  });

  it('should not modify token if user and account are not provided', async () => {
    const result = await authOptions.callbacks.jwt({
      token: mockToken,
      user: {} as User,
      account: null,
    });

    expect(result).toEqual(mockToken);
  });
});
