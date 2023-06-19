import { getNextAppURL } from '@utils';
import { logger } from '@logger';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

export const SiweProvider = () =>
  CredentialsProvider({
    name: 'Ethereum',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0',
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0',
      },
    },
    async authorize(credentials, req) {
      try {
        const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
        const nextAuthUrl = new URL(getNextAppURL());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nonce = await getCsrfToken({ req: { headers: req.headers } });
        logger.info({ nonce });
        const result = await siwe.verify({
          signature: credentials?.signature || '',
          domain: nextAuthUrl.host,
          nonce,
        });
        //TODO add api call to get user from backend with siwe.address. If user not found create one with uuid and siwe.address
        console.log({ result, siwe });
        if (result.success) {
          return {
            id: siwe.address, //TODO remove because come from backend user table
            address: siwe.address,
          };
        } else throw new Error('Invalid signature');
      } catch (error) {
        console.error({ error });
        return null;
      }
    },
  });
