import { adminSdk } from '@gql/admin/api';
import { Roles_Enum } from '@gql/shared/types';
import { Cache } from '@next/cache';
import { AppUser } from '@next/types';
import { Roles_Enum_Not_Const_Values } from '@roles/types';
import { randomUUID } from 'crypto';
import { SiweMessage } from 'siwe';

interface Invitation {
  nonce: string;
  role: Roles_Enum;
  organizerId: string;
  eventId: string;
  address: string;
  senderAddress: string;
  expiration: number; // Timestamp indicating when the invitation expires
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

export class RoleInvitationService {
  private cache: Cache;

  constructor(cache?: Cache) {
    this.cache = cache || new Cache();
  }

  private getInvitationKey(senderAddress: string, nonce: string): string {
    return `invitation:${senderAddress}:${nonce}`;
  }

  private getInviterSetKey(senderAddress: string): string {
    return `inviter_invitations:${senderAddress}`;
  }

  async invitationForRoleExists({
    senderAddress,
    address,
    role,
    organizerId,
    eventId,
  }: InvitationForRoleExistsProps) {
    const invitations = await this.getInvitationsByInviter({
      senderAddress,
    });
    if (
      invitations &&
      invitations.length &&
      invitations.find((i) => {
        return (
          i.address === address &&
          i.role === role &&
          i.organizerId === organizerId &&
          (i.eventId === eventId || !eventId)
        );
      })
    ) {
      return true;
    }
    const res = await adminSdk.GetAccountByAddress({
      address: address,
    });
    const invited = res.account?.[0];

    // here mean that the invited user is not registered yet so he will not have any role in the db yet
    if (!invited) return false;

    const resRole = await adminSdk.GetRoleMinimal({
      accountId: invited?.id,
      role: role as unknown as Roles_Enum,
      organizerId,
      eventId,
    });
    return !!resRole?.roleAssignments?.[0];
  }

  async createInvitation(
    invitationProps: CreateInvitationProps,
  ): Promise<string> {
    const nonce = randomUUID(); // Generating a unique identifier for the invitation
    const expiration = Date.now() + 60 * 60 * 24 * 1000; // 24 hours from now
    const invitation: Invitation = { nonce, ...invitationProps, expiration };

    // Store the invitation in the cache with a specific expiry of 24h
    await this.cache.kv.set(
      this.getInvitationKey(invitation.senderAddress, nonce),
      invitation,
    );

    // Add the nonce to the set of the inviter's sent invitations
    await this.cache.kv.sadd(
      this.getInviterSetKey(invitation.senderAddress),
      nonce,
    );

    // TODO: Send this nonce to the user's wallet address using your preferred secure channel
    return nonce;
  }

  async fetchInvitation(senderAddress: string, nonce: string) {
    const invitation = (await this.cache.kv.get(
      this.getInvitationKey(senderAddress, nonce),
    )) as Invitation | null;

    if (invitation && invitation.expiration < Date.now()) {
      // If the invitation has expired, perform cleanup
      await this.deleteInvitation({ senderAddress, nonce });
      return null; // Indicate that the invitation is no longer valid
    }

    return invitation;
  }

  async getInvitationsByInviter({
    senderAddress,
  }: GetInvitationsByInviterProps) {
    const nonces = await this.cache.kv.smembers(
      this.getInviterSetKey(senderAddress),
    );

    // Retrieve all invitations for the given nonces
    const invitationsPromises = nonces.map((nonce) => {
      return this.fetchInvitation(senderAddress, nonce) as Promise<Invitation>;
    });

    const invitations = await Promise.all(invitationsPromises);

    // Filter out any null results from expired or non-existent invitations
    return invitations.filter((invitation) => invitation !== null);
  }

  async deleteInvitation({ senderAddress, nonce }: DeleteInvitationProps) {
    // Delete the invitation data
    await this.cache.kv.del(this.getInvitationKey(senderAddress, nonce));

    // Remove the nonce from the inviter's set of sent invitations
    await this.cache.kv.srem(this.getInviterSetKey(senderAddress), nonce);
  }

  async acceptInvitation({
    message,
    signature,
    user,
    inviter,
  }: AcceptInvitationProps) {
    // Reconstruct the SIWE message from the payload
    const siweMessage = new SiweMessage(message);
    const verificationResult = await siweMessage.verify({ signature });

    if (!verificationResult) {
      throw new Error('Invalid SIWE message signature.');
    }

    // Retrieve the invitation from the cache using nonce from the SIWE message
    const invitation = await this.fetchInvitation(
      inviter.address,
      siweMessage.nonce,
    );
    if (!invitation || invitation.address !== user.address) {
      throw new Error('Invalid or expired invitation.');
    }

    // If the signature is valid, proceed with role assignment
    await adminSdk.CreateRoleAssignment({
      input: {
        role: invitation.role,
        organizerId: invitation.organizerId,
        eventId: invitation.eventId,
        accountId: user.id,
        invitedById: inviter.id,
      },
    });

    // Upon successful acceptance, remove the invitation from the cache and the inviter's set
    await this.deleteInvitation({
      senderAddress: invitation.senderAddress,
      nonce: siweMessage.nonce,
    });
    // TODO: inform the inviter that the invitation has been accepted
  }

  async declineInvitation({ user, inviter, nonce }: DeclineInvitationProps) {
    // Retrieve the invitation from the cache using the nonce provided
    const invitation = await this.fetchInvitation(inviter.address, nonce);
    if (!invitation || invitation.address !== user.address) {
      throw new Error('Invalid or expired invitation.');
    }
    // Remove the invitation from the cache since it's been declined
    await this.deleteInvitation({
      senderAddress: invitation.senderAddress,
      nonce,
    });
    // TODO: inform the inviter that the invitation has been declined
  }

  async verifyInvitation({
    nonce,
    user,
    senderAddress,
  }: VerifyInvitationProps) {
    // Retrieve the invitation from the cache using nonce from the SIWE message
    const invitation = await this.fetchInvitation(senderAddress, nonce);
    if (!invitation || invitation.address !== user.address) {
      throw new Error('Invalid or expired invitation.');
    }
    if (invitation.expiration < Date.now()) {
      // If the invitation has expired, perform cleanup
      await this.deleteInvitation({ senderAddress, nonce });
      throw new Error('Invalid or expired invitation.');
    }
    const res = await adminSdk.GetAccountByAddress({
      address: invitation.senderAddress,
    });
    const inviter = res.account?.[0];

    if (!inviter) {
      throw new Error('Invalid or expired invitation.');
    }
    // Return the invitation if it is still valid
    return { invitation, inviter };
  }
}

interface InviteAccountWithRoleProps {
  user: AppUser;
  role: Roles_Enum;
  organizerId: string;
  eventId?: string;
}

class RoleAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleAuthorizationError';
  }
}

export class RoleAuthorization {
  async inviteAccountWithRole({
    user,
    role,
    organizerId,
    eventId,
  }: InviteAccountWithRoleProps) {
    const inviterRole = user.role?.role;
    if (!inviterRole) {
      throw new RoleAuthorizationError("User doesn't have a role");
    }
    if (user.role?.organizerId !== organizerId) {
      throw new RoleAuthorizationError(
        "User doesn't have a role for this organizer",
      );
    }
    if (role && !Object.values(Roles_Enum_Not_Const_Values).includes(role)) {
      throw new RoleAuthorizationError('Invalid role');
    }
    switch (user.role?.role) {
      case Roles_Enum.OrganizerSuperAdmin:
        return true;
      case Roles_Enum.OrganizerHumanResources:
        if (
          [
            Roles_Enum.OrganizerSuperAdmin,
            Roles_Enum.OrganizerHumanResources,
          ].includes(role)
        )
          return false;
        return true;
      default:
        return false;
    }
  }
  async readAndWritePassesFile(user: AppUser) {
    const role = user.role?.role;
    if (!role) {
      throw new RoleAuthorizationError("User doesn't have a role");
    }
    switch (role) {
      case Roles_Enum.OrganizerSuperAdmin:
        return true;
      case Roles_Enum.OrganizerAdmin:
        return true;
      default:
        return false;
    }
  }

  async readOrganizerEventManagement(user: AppUser) {
    const role = user.role?.role;
    if (!role) {
      throw new RoleAuthorizationError("User doesn't have a role");
    }
    switch (role) {
      case Roles_Enum.OrganizerValidator:
        return false;
      case Roles_Enum.OrganizerHumanResources:
        return false;
      default:
        return true;
    }
  }
}

// // This function would be run in the user's environment, such as a web browser.
// async function createAndSignSiweMessage(nonce, userAddress, domain) {
//   // The domain is the domain name of the application that the user is interacting with.
//   const message = new SiweMessage({
//     domain: domain,
//     address: userAddress,
//     statement: 'I am signing my one-time nonce: ' + nonce,
//     uri: window.location.origin,
//     version: '1',
//     chainId: 1,
//     nonce: nonce
//   });

//   // Construct the message to be signed
//   const messageToSign = message.prepareMessage();

//   // Sign the message using the user's Ethereum wallet
//   // This will usually be done through a wallet provider, such as MetaMask
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   const signature = await signer.signMessage(messageToSign);

//   // Send the message and signature back to the service
//   // This could be through an API call or a WebSocket connection
//   return {
//     message: messageToSign,
//     signature: signature,
//     address: userAddress
//   };
// }

// // Example usage
// const nonce = 'ReceivedNonceFromInvitation';
// const userAddress = '0xUserWalletAddress';
// const domain = 'yourdomain.com';

// createAndSignSiweMessage(nonce, userAddress, domain)
//   .then(result => {
//     // The result contains the signed message and signature
//     // Send this to the server to accept the invitation
//   })
//   .catch(error => {
//     console.error('Error signing message:', error);
//   });
