import { Roles_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { RoleAuthorization, RoleInvitationService } from '@roles/admin';
import { backOfficeAccounts } from '@test-utils/gql';
import { inviteAccountWithRole } from './inviteAccountWithRole';

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@roles/admin', () => {
  return {
    RoleAuthorization: jest.fn().mockImplementation(() => {
      return { inviteAccountWithRole: jest.fn() };
    }),
    RoleInvitationService: jest.fn().mockImplementation(() => {
      return {
        invitationForRoleExists: jest.fn(),
        createInvitation: jest.fn(),
      };
    }),
  };
});

describe('inviteAccountWithRole', () => {
  const authzMock = jest.fn();
  (RoleAuthorization as jest.Mock).mockImplementation(() => {
    return { inviteAccountWithRole: authzMock };
  });
  const user = backOfficeAccounts.alpha_organizer_super_admin_user;

  const mockInviteProps = {
    role: Roles_Enum.OrganizerAdmin,
    address: '0x2CDE8fb599b7c656e7594959960DbeA1bC2e15F2',
  };
  const mockInvite = {
    ...mockInviteProps,
    senderAddress: user.address,
    organizerId: user.role.organizerId,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Invites account with role successfully when user is logged in and authorized
  it('should invite account with role successfully when user is logged in and authorized', async () => {
    const inviteRoleMock = {
      invitationForRoleExists: jest.fn(),
      createInvitation: jest.fn(),
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(user);

    (RoleInvitationService as jest.Mock).mockImplementation(
      () => inviteRoleMock,
    );

    authzMock.mockReturnValue(true);
    inviteRoleMock.invitationForRoleExists.mockResolvedValue(false);
    inviteRoleMock.createInvitation.mockResolvedValue('invitation');

    const result = await inviteAccountWithRole(mockInviteProps);

    expect(result).toEqual('invitation');
  });

  // Throws error when user is not authorized to invite account with role
  it('should throw error when user is not authorized to invite account with role', async () => {
    const inviteRoleMock = {
      invitationForRoleExists: jest.fn(),
      createInvitation: jest.fn(),
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(user);
    (RoleInvitationService as jest.Mock).mockImplementation(
      () => inviteRoleMock,
    );

    authzMock.mockReturnValue(false);

    await expect(inviteAccountWithRole(mockInviteProps)).rejects.toThrow(
      'User not authorized to invite account with role',
    );
  });

  // Throws error when user does not have a role
  it('should throw error when user does not have a role', async () => {
    const inviteRoleMock = {
      invitationForRoleExists: jest.fn(),
      createInvitation: jest.fn(),
    };

    (getCurrentUser as jest.Mock).mockResolvedValue({ ...user, role: null });
    (RoleInvitationService as jest.Mock).mockImplementation(
      () => inviteRoleMock,
    );

    authzMock.mockReturnValue(false);

    await expect(inviteAccountWithRole(mockInviteProps)).rejects.toThrow(
      'User does not have a role',
    );
  });

  it('should throw error when user invited already have the role', async () => {
    const inviteRoleMock = {
      invitationForRoleExists: jest.fn().mockResolvedValue(true),
      createInvitation: jest.fn(),
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(user);
    (RoleInvitationService as jest.Mock).mockImplementation(
      () => inviteRoleMock,
    );

    authzMock.mockReturnValue(true);

    await expect(inviteAccountWithRole(mockInviteProps)).rejects.toThrow(
      'User already invited to this role',
    );
  });
});
