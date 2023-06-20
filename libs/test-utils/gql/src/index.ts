/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
import { getSdk as userSdk } from './generated/test-user';
import type { User, Sdk } from './generated/test-user';
import { fetchData } from '@next/hasura/fetcher';

// setup env variables
require('dotenv').config({ path: './tools/test/.env.test.jest' });

export const users = {
  seb_google: {
    id: '20c0bc91e1254445d459fc6ac97206f6bb9223e71c764c49a778f8b84d3fc57f',
    address: '0xC68bD7C7f656290071E52D1aA617D9cB44677D4D',
    email: 'sebpalluel@gmail.com',
    emailVerified: true,
  },
  alpha_user: {
    id: '4c2aa03a7dcb06ab7ac2ba0783d2e466a525e1e5794a42b2a0fa9f61fa7a2965',
    address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
    email: 'alpha_user@test.io',
    emailVerified: false,
  },
  beta_user: {
    id: '1d6dead4e698ddfd4a92cd19afd075611feaedfd149edd7462b80f718e3b2183',
    address: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
    email: 'beta_user@test.io',
    emailVerified: false,
  },
};

type UserOptions = {
  allowedRoles?: string[];
  defaultRole: string;
  userId: string;
};

// generate a JWT that includes roles, userId
const generateJwt = (options: UserOptions): string =>
  jwt.sign(
    JSON.stringify({
      roles: options.allowedRoles,
      userId: options.userId,
    }),
    // private key provided on docker-compose for test
    '3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R'
  );

// configure the client
export const sdkClient = (options: UserOptions): Sdk => {
  // if we do not provide allowedRoles for the client we assume that the defaultRole is an allowed role
  if ('defaultRole' in options && !options.allowedRoles) {
    options.allowedRoles = [options.defaultRole];
  }
  const jwt = generateJwt(options);
  return userSdk(fetchData({ jwt }));
};

export const alphaAdminClient = (): Sdk & { me: User } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: users.alpha_user.id,
    }),
    me: users.alpha_user,
  };
};

export const betaAdminClient = (): Sdk & { me: User } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: users.beta_user.id,
    }),
    me: users.beta_user,
  };
};

export const sebGoogleClient = (): Sdk & { me: User } => {
  return {
    ...sdkClient({
      defaultRole: 'user',
      userId: users.seb_google.id,
    }),
    me: users.seb_google,
  };
};
