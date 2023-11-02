import { getCurrentUser } from '@next/next-auth/user';
import {
  RoleAuthorization,
  RoleInvitationService,
  type CreateInvitationProps,
} from '@roles/admin';

export type InviteAccountWithRoleProps = Omit<
  CreateInvitationProps,
  'expiration' | 'user' | 'organizerId' | 'senderAddress'
>;

export const inviteAccountWithRole = async ({
  role,
  address,
  eventId,
}: InviteAccountWithRoleProps) => {
  const user = await getCurrentUser();
  const authz = new RoleAuthorization();
  if (!user) throw new Error('User not logged in');
  if (!user.role) throw new Error('User does not have a role');
  const invite: CreateInvitationProps = {
    role,
    address,
    eventId,
    senderAddress: user.address,
    organizerId: user.role.organizerId,
  };
  if (
    !authz.inviteAccountWithRole({
      user,
      role,
      organizerId: invite.organizerId,
      eventId: invite.eventId,
    })
  )
    throw new Error('User not authorized to invite account with role');

  const inviteRole = new RoleInvitationService();
  if (await inviteRole.invitationForRoleExists(invite)) {
    throw new Error('User already invited to this role');
  }
  return inviteRole.createInvitation(invite);
};
