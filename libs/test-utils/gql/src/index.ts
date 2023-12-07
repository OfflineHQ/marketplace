/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
import {
  getSdk as anonymousSdk,
  type Sdk as AnonymousSdk,
} from '@gql/anonymous/api';
import {
  KycLevelName_Enum,
  KycStatus_Enum,
  Roles_Enum,
} from '@gql/shared/types';
import { getSdk as userSdk, type Sdk as UserSdk } from '@gql/user/api';
import type { AppUser } from '@next/types';
import { getHasuraEndpoint } from '@shared/client';
import { isBackOffice } from '@shared/server';

type Opts = {
  anonymous?: boolean;
  jwt?: string;
};
const fetchDataForTest = (opts: Opts = { jwt: '', anonymous: false }) => {
  return async <TResult, TVariables>(
    doc: string,
    variables: TVariables,
  ): Promise<TResult> => {
    const { jwt, anonymous } = opts;
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };
    if (!anonymous && jwt)
      headers[isBackOffice() ? 'back-office-jwt' : 'marketplace-jwt'] = jwt;

    const res = await fetch(getHasuraEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: doc,
        variables,
      }),
    });
    const json = await res.json();
    if (json.errors) {
      const { message } = json.errors[0] || 'Error';
      throw new Error(message);
    }

    return json.data;
  };
};

export const accounts = {
  google_user: {
    id: 'ac542c34-1907-451c-94be-5df69a959080',
    address: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
    email: 'googl_user@gmail.com',
  } satisfies AppUser,
  alpha_user: {
    id: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
    address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
    email: 'alpha_user@test.io',
    kyc: {
      applicantId: '653bb6d8f8865a0b96363bf3',
      reviewStatus: KycStatus_Enum.Completed,
      levelName: KycLevelName_Enum.AdvancedKycLevel,
    },
  } satisfies AppUser,
  beta_user: {
    id: '76189546-6368-4325-8aad-220e03837b7e',
    address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
  } satisfies AppUser,
};

const H256SecretMarketplace = 'ALjZVyWYniAX+6A86TilZ9oWJ4t8ZdCwDRrve1SwC/I=';
const H256SecretBackOffice = 'HGTRbJ6IaEoByH8KhA+BKV0Bgug+R7RSydnMbex2cZg=';

// generate a JWT that includes roles, userId
// secret: private key provided on docker-compose for test, either for marketplace or back-office
const generateJwt = (user: AppUser, secret: string, role?: string): string =>
  jwt.sign(JSON.stringify({ user, role }), secret);

export const usersJwt = {
  google_user: generateJwt(accounts.google_user, H256SecretMarketplace, 'user'),
  alpha_user: generateJwt(accounts.alpha_user, H256SecretMarketplace, 'user'),
  beta_user: generateJwt(accounts.beta_user, H256SecretMarketplace, 'user'),
};

// Define back-office users
export const backOfficeAccounts = {
  alpha_organizer_super_admin_user: {
    ...accounts.alpha_user,
    role: {
      role: Roles_Enum.OrganizerSuperAdmin,
      organizerId: 'clizzky8kap2t0bw7wka9a2id',
      eventId: '',
    },
  } satisfies AppUser,
  alpha_organizer2_admin_user: {
    ...accounts.alpha_user,
    role: {
      role: Roles_Enum.OrganizerAdmin,
      organizerId: 'dummy',
      eventId: '',
    },
  } satisfies AppUser,
  beta_organizer_admin_user: {
    ...accounts.beta_user,
    role: {
      role: Roles_Enum.OrganizerAdmin,
      organizerId: 'clizzky8kap2t0bw7wka9a2id',
      eventId: '',
    },
  } satisfies AppUser,
  delta_user: {
    id: '9660cf3b-65ec-4ac5-a671-7eac4d93a842',
    address: '0x2CDE8fb599b7c656e7594959960DbeA1bC2e15F2',
    email: '',
  } satisfies AppUser,
  // Add more users as needed...
};

// Generate JWT for back-office users
export const backOfficeUsersJwt = {
  alpha_user_back_office: generateJwt(
    accounts.alpha_user,
    H256SecretBackOffice,
    'user',
  ),
  beta_user_back_office: generateJwt(
    accounts.beta_user,
    H256SecretBackOffice,
    'user',
  ),
  alpha_organizer_super_admin_user: generateJwt(
    backOfficeAccounts.alpha_organizer_super_admin_user,
    H256SecretBackOffice,
    'admin',
  ),
  beta_organizer_admin_user: generateJwt(
    backOfficeAccounts.beta_organizer_admin_user,
    H256SecretBackOffice,
    'auditor',
  ),
  delta_user: generateJwt(
    backOfficeAccounts.delta_user,
    H256SecretBackOffice,
    'user',
  ),
  // Add more JWTs as needed...
};

export const alphaUserClient = ({
  isBackOffice = false,
}: { isBackOffice?: boolean } = {}): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(
      fetchDataForTest({
        jwt: isBackOffice
          ? backOfficeUsersJwt.alpha_user_back_office
          : usersJwt.alpha_user,
      }),
    ),
    me: accounts.alpha_user,
  };
};

export const betaUserClient = ({
  isBackOffice = false,
}: { isBackOffice?: boolean } = {}): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(
      fetchDataForTest({
        jwt: isBackOffice
          ? backOfficeUsersJwt.beta_user_back_office
          : usersJwt.beta_user,
      }),
    ),
    me: accounts.beta_user,
  };
};

export const googleUserClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.google_user })),
    me: accounts.google_user,
  };
};

export const anonymousClient = (): AnonymousSdk => {
  return anonymousSdk(fetchDataForTest({ anonymous: true }));
};

// Create clients for back-office users
//TODO create and use appropriate SDKs for back-office users (organizerSuperAdminSdk, organizerAdminSdk, etc...)
export const alphaOrganizerSuperAdminClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(
      fetchDataForTest({
        jwt: backOfficeUsersJwt.alpha_organizer_super_admin_user,
      }),
    ),
    me: backOfficeAccounts.alpha_organizer_super_admin_user,
  };
};

export const betaOrganizerAdminClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(
      fetchDataForTest({ jwt: backOfficeUsersJwt.beta_organizer_admin_user }),
    ),
    me: backOfficeAccounts.beta_organizer_admin_user,
  };
};

export const deltaUserClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: backOfficeUsersJwt.delta_user })),
    me: backOfficeAccounts.delta_user,
  };
};
