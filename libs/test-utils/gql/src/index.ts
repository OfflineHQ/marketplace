/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
import { getSdk as userSdk, type Sdk } from './generated/test-account';
import type { Account } from '@gql/shared/types';
import { endpointUrl } from '@next/hasura/fetcher';

// setup env variables
require('dotenv').config({ path: './tools/test/.env.test.jest' });

// In your accounts sdk file:

type Opts = {
  admin?: boolean;
  jwt?: string;
};
const fetchDataForTest = (opts: Opts = { jwt: '' }) => {
  return async <TResult, TVariables>(
    doc: string,
    variables: TVariables
  ): Promise<TResult> => {
    const { jwt } = opts;
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
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
      const { message } = json.errors[0] || 'Error..';
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
  allowedRoles?: string[];
  defaultRole: string;
  userId: string;
};

// generate a JWT that includes roles, userId
const generateJwt = (options: AccountOptions): string =>
  jwt.sign(
    JSON.stringify({
      roles: options.allowedRoles,
      userId: options.userId,
    }),
    // private key provided on docker-compose for test
    '3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R'
  );

// configure the client
export const sdkClient = (options: AccountOptions): Sdk => {
  // if we do not provide allowedRoles for the client we assume that the defaultRole is an allowed role
  if ('defaultRole' in options && !options.allowedRoles) {
    options.allowedRoles = [options.defaultRole];
  }
  const jwt = generateJwt(options);
  return userSdk(fetchDataForTest({ jwt }));
};

export const alphaAdminClient = (): Sdk & { me: Account } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: accounts.alpha_user.id,
    }),
    me: accounts.alpha_user,
  };
};

export const betaAdminClient = (): Sdk & { me: Account } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: accounts.beta_user.id,
    }),
    me: accounts.beta_user,
  };
};

export const sebGoogleClient = (): Sdk & { me: Account } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: accounts.seb_google.id,
    }),
    me: accounts.seb_google,
  };
};
