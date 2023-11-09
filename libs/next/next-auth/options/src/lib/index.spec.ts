// import env from '@env/server';
// import { isBackOffice } from '@shared/server';
import { getAccount } from '@features/account/api';
import {
  KycLevelName_Enum,
  KycStatus_Enum,
  Roles_Enum,
} from '@gql/shared/types';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { createOptions } from './';

jest.mock('@next/siwe/provider', () => ({
  SiweProvider: jest.fn(() => ({})),
}));

// jest.mock('@shared/server', () => ({
//   ...jest.requireActual('@shared/server'),
//   isBackOffice: jest.fn(),
// }));

jest.mock('@features/account/api', () => ({
  ...jest.requireActual('@features/account/api'),
  getAccount: jest.fn(),
}));

describe('createOptions callbacks', () => {
  const mockUser: User = {
    id: 'dummy',
    address: 'user-xyz',
    email: 'user@test.com',
    name: 'Test User',
  };
  const mockToken: JWT = {
    exp: 1615680311,
    iat: 1615680311,
    sub: 'user-xyz',
    user: mockUser,
  };
  describe('User in web app', () => {
    it('should add access, provider, providerType, and role fields to token if user and account are provided', async () => {
      const result = await createOptions().callbacks.jwt({
        token: mockToken,
        user: mockUser,
        account: {
          providerAccountId: 'dummy',
          type: 'credentials',
          provider: 'credentials',
        },
      });

      expect(result).toEqual({
        exp: 1615680311,
        iat: 1615680311,
        sub: 'user-xyz',
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
    it('should not modify token if user and account are not provided', async () => {
      const result = await createOptions().callbacks.jwt({
        token: mockToken,
        user: {} as User,
        account: null,
      });

      expect(result).toEqual(mockToken);
    });
  });

  describe('User in back office', () => {
    const mockOrganizer = {
      ...mockUser,
      kyc: {
        applicantId: 'applicant-xyz',
        levelName: KycLevelName_Enum.AdvancedKycLevel,
        reviewStatus: KycStatus_Enum.Completed,
      },
      roles: [
        { organizerId: 'organizer-xyz-1', role: Roles_Enum.OrganizerAdmin },
        {
          organizerId: 'organizer-xyz-2',
          role: Roles_Enum.OrganizerContentManager,
        },
        { organizerId: 'organizer-xyz-3', role: Roles_Enum.OrganizerAdmin },
      ],
    };

    const mockOrganizerRole = mockOrganizer.roles[2];

    it('should return correct token with updated role if role is part of user roleAssignments', async () => {
      process.env.APP = 'BACKOFFICE';

      (getAccount as jest.Mock).mockResolvedValueOnce({ ...mockOrganizer });
      const result = await createOptions().callbacks.jwt({
        token: { ...mockToken, user: mockOrganizer },
        user: mockOrganizer,
        trigger: 'update',
        account: {
          providerAccountId: 'dummy',
          type: 'credentials',
          provider: 'credentials',
        },
        session: {
          role: mockOrganizerRole,
        },
      });

      expect(result).toEqual({
        exp: 1615680311,
        iat: 1615680311,
        sub: 'user-xyz',
        user: { ...mockOrganizer, role: mockOrganizerRole },
        clientId: 'back-office',
        access: {
          pathPermissions: [
            {
              match: {
                path: `/${process.env.UPLOAD_PATH_PREFIX}/organizers/${mockOrganizerRole.organizerId}`,
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

    it('should return correct token with no role and no access if user update token without role', async () => {
      process.env.APP = 'BACKOFFICE';
      (getAccount as jest.Mock).mockResolvedValueOnce({
        ...mockOrganizer,
        role: null,
      });
      const result = await createOptions().callbacks.jwt({
        token: { ...mockToken, user: mockOrganizer },
        user: mockOrganizer,
        trigger: 'update',
        account: {
          providerAccountId: 'dummy',
          type: 'credentials',
          provider: 'credentials',
        },
      });

      expect(result).toEqual({
        exp: 1615680311,
        iat: 1615680311,
        sub: 'user-xyz',
        user: { ...mockOrganizer, role: null },
        clientId: 'back-office',
        access: undefined,
      });
    });

    it("shouldn't add access to token if user role is not authorized", async () => {
      const mockOrganizerNotAuthorized = {
        ...mockUser,
        role: {
          organizerId: 'organizer-xyz',
          role: Roles_Enum.OrganizerContentManager,
        },
      };
      process.env.APP = 'BACKOFFICE';
      const result = await createOptions().callbacks.jwt({
        token: mockToken,
        user: mockOrganizerNotAuthorized,
        account: {
          providerAccountId: 'dummy',
          type: 'credentials',
          provider: 'credentials',
        },
      });

      expect(result).toEqual({
        exp: 1615680311,
        iat: 1615680311,
        sub: 'user-xyz',
        user: mockOrganizerNotAuthorized,
        provider: 'credentials',
        providerType: 'credentials',
        clientId: 'back-office',
        access: undefined,
      });
    });

    it("shouldn't return token with role if role is not part of user roleAssignments", async () => {
      process.env.APP = 'BACKOFFICE';

      (getAccount as jest.Mock).mockResolvedValueOnce(mockOrganizer);
      await expect(
        createOptions().callbacks.jwt({
          token: { ...mockToken, user: mockOrganizer },
          user: mockOrganizer,
          trigger: 'update',
          session: {
            role: {
              ...mockOrganizerRole,
              organizerId: 'organizer-xyz-unknown',
            },
          },
          account: {
            providerAccountId: 'dummy',
            type: 'credentials',
            provider: 'credentials',
          },
        }),
      ).rejects.toThrowError('Unauthorized to switch to this role');
    });

    it("shouldn't return token with role if app is not back office", async () => {
      process.env.APP = 'WEB';
      (getAccount as jest.Mock).mockResolvedValueOnce(mockOrganizer);
      await expect(
        createOptions().callbacks.jwt({
          token: { ...mockToken, user: mockOrganizer },
          user: mockOrganizer,
          trigger: 'update',
          account: {
            providerAccountId: 'dummy',
            type: 'credentials',
            provider: 'credentials',
          },
          session: {
            role: mockOrganizerRole,
          },
        }),
      ).rejects.toThrowError(
        'Unauthorized to access roles outside of back office',
      );
    });

    it("shouldn't return token with role if user kyc is not validated", async () => {
      process.env.APP = 'BACKOFFICE';
      (getAccount as jest.Mock).mockResolvedValueOnce({
        mockOrganizer,
        kyc: { ...mockOrganizer.kyc, reviewStatus: KycStatus_Enum.Pending },
      });
      await expect(
        createOptions().callbacks.jwt({
          token: { ...mockToken, user: mockOrganizer },
          user: mockOrganizer,
          trigger: 'update',
          account: {
            providerAccountId: 'dummy',
            type: 'credentials',
            provider: 'credentials',
          },
          session: {
            role: mockOrganizerRole,
          },
        }),
      ).rejects.toThrowError(
        'Unauthorized to switch to role while the Advanced KYC is not validated',
      );
    });
  });
});
