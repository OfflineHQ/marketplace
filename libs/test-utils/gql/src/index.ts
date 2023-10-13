/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
import {
  getSdk as anonymousSdk,
  type Sdk as AnonymousSdk,
} from '@gql/anonymous/api';
import { KycLevelName_Enum, KycStatus_Enum } from '@gql/shared/types';
import { getSdk as userSdk, type Sdk as UserSdk } from '@gql/user/api';
import type { AppUser } from '@next/types';
import { getHasuraEndpoint } from '@shared/client';

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
      Authorization: !anonymous ? `Bearer ${jwt}` : '',
    };

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
      applicantId: '64d5f7a58f241166d756ba33',
      reviewStatus: KycStatus_Enum.Completed,
      levelName: KycLevelName_Enum.BasicKycLevel,
    },
  } satisfies AppUser,
  beta_user: {
    id: '76189546-6368-4325-8aad-220e03837b7e',
    address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
  } satisfies AppUser,
  organizer_user: {
    id: '9660cf3b-65ec-4ac5-a671-7eac4d93a842',
    address: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
    email: 'test@offline.live',
    organizerId: 'clizzky8kap2t0bw7wka9a2id',
  } satisfies AppUser,
};

type AccountOptions = {
  defaultRole: string;
  userId: string;
};

// generate a JWT that includes roles, userId
const generateJwt = (options: AccountOptions): string =>
  jwt.sign(
    JSON.stringify({
      roles: [options.defaultRole],
      userId: options.userId,
    }),
    // private key provided on docker-compose for test
    '3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R',
  );

export const usersJwt = {
  google_user: generateJwt({
    defaultRole: 'user',
    userId: accounts.google_user.id,
  }),
  alpha_user: generateJwt({
    defaultRole: 'user',
    userId: accounts.alpha_user.id,
  }),
  beta_user: generateJwt({
    defaultRole: 'user',
    userId: accounts.beta_user.id,
  }),
};

export const alphaUserClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.alpha_user })),
    me: accounts.alpha_user,
  };
};

export const betaUserClient = (): UserSdk & { me: AppUser } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.beta_user })),
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
