/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
import { getSdk as userSdk, type Sdk as UserSdk } from '@gql/user/api';
import {
  getSdk as anonymousSdk,
  type Sdk as AnonymousSdk,
} from '@gql/anonymous/api';
import type { Account } from '@gql/shared/types';
import { endpointUrl } from '@next/hasura/shared';

// setup env variables
require('dotenv').config({ path: './tools/test/.env.test.jest' });

// In your accounts sdk file:

type Opts = {
  anonymous?: boolean;
  jwt?: string;
};
const fetchDataForTest = (opts: Opts = { jwt: '', anonymous: false }) => {
  return async <TResult, TVariables>(
    doc: string,
    variables: TVariables
  ): Promise<TResult> => {
    const { jwt, anonymous } = opts;
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
      Authorization: !anonymous ? `Bearer ${jwt}` : '',
    };

    const res = await fetch(endpointUrl(), {
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
  seb_google: {
    id: 'ac542c34-1907-451c-94be-5df69a959080',
    address: '0x1bBEdB07706728A19c9dB82d3c420670D8040591',
    email: 'sebpalluel@gmail.com',
    emailVerified: true,
    isOrganizer: true,
  } satisfies Account,
  alpha_user: {
    id: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
    address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
    email: 'alpha_user@test.io',
    emailVerified: false,
    isOrganizer: false,
  } satisfies Account,
  beta_user: {
    id: '76189546-6368-4325-8aad-220e03837b7e',
    address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
    email: 'beta_user@test.io',
    emailVerified: false,
    isOrganizer: false,
  } satisfies Account,
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
    '3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R'
  );

export const usersJwt = {
  seb_google: generateJwt({
    defaultRole: 'user',
    userId: accounts.seb_google.id,
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

export const alphaAdminClient = (): UserSdk & { me: Account } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.alpha_user })),
    me: accounts.alpha_user,
  };
};

export const betaAdminClient = (): UserSdk & { me: Account } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.beta_user })),
    me: accounts.beta_user,
  };
};

export const sebGoogleClient = (): UserSdk & { me: Account } => {
  return {
    ...userSdk(fetchDataForTest({ jwt: usersJwt.seb_google })),
    me: accounts.seb_google,
  };
};

export const anonymousClient = (): AnonymousSdk => {
  return anonymousSdk(fetchDataForTest({ anonymous: true }));
};
