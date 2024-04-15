import { Roles_Enum } from '@gql/shared/types';
import { NextRedis } from '@next/redis';
import { AppUser } from '@next/types';
interface Invitation {
  nonce: string;
  role: Roles_Enum;
  organizerId: string;
  eventId: string;
  address: string;
  senderAddress: string;
  expiration: number;
}
export type CreateInvitationProps = Omit<Invitation, 'nonce' | 'expiration'>;
interface InvitationForRoleExistsProps {
  senderAddress: string;
  address: string;
  role: Roles_Enum;
  organizerId: string;
  eventId: string;
}
interface AcceptInvitationProps {
  message: string;
  signature: string;
  user: AppUser;
  inviter: AppUser;
}
interface DeclineInvitationProps
  extends Pick<AcceptInvitationProps, 'user' | 'inviter'> {
  nonce: string;
}
interface VerifyInvitationProps {
  nonce: string;
  user: AppUser;
  senderAddress: string;
}
interface GetInvitationsByInviterProps {
  senderAddress: string;
}
interface DeleteInvitationProps {
  nonce: string;
  senderAddress: string;
}
export declare class RoleInvitationService {
  private cache;
  constructor(cache?: NextRedis);
  private getInvitationKey;
  private getInviterSetKey;
  invitationForRoleExists({
    senderAddress,
    address,
    role,
    organizerId,
    eventId,
  }: InvitationForRoleExistsProps): Promise<boolean>;
  createInvitation(invitationProps: CreateInvitationProps): Promise<string>;
  fetchInvitation(
    senderAddress: string,
    nonce: string,
  ): Promise<Invitation | null>;
  getInvitationsByInviter({
    senderAddress,
  }: GetInvitationsByInviterProps): Promise<Invitation[]>;
  deleteInvitation({
    senderAddress,
    nonce,
  }: DeleteInvitationProps): Promise<void>;
  acceptInvitation({
    message,
    signature,
    user,
    inviter,
  }: AcceptInvitationProps): Promise<void>;
  declineInvitation({
    user,
    inviter,
    nonce,
  }: DeclineInvitationProps): Promise<void>;
  verifyInvitation({
    nonce,
    user,
    senderAddress,
  }: VerifyInvitationProps): Promise<{
    invitation: Invitation;
    inviter: {
      __typename?: 'account' | undefined;
      id: any;
      address: string;
    };
  }>;
}
interface InviteAccountWithRoleProps {
  user: AppUser;
  role: Roles_Enum;
  organizerId: string;
  eventId?: string;
}
export declare class RoleAuthorization {
  inviteAccountWithRole({
    user,
    role,
    organizerId,
    eventId,
  }: InviteAccountWithRoleProps): Promise<boolean>;
  readAndWritePassesFile(user: AppUser): Promise<boolean>;
  readOrganizerEventManagement(user: AppUser): Promise<boolean>;
}
export {};
