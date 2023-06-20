import { getNextAppURL } from '@utils';
import { logger } from '@logger';
import { handleUser } from '@features/user/api';
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
      address: {
        type: 'text',
      },
      email: {
        type: 'text',
      },
      emailVerified: {
        type: 'boolean',
      },
    },
    async authorize(credentials, req) {
      try {
        const { message, signature, address, email, emailVerified } =
          credentials;
        const siwe = new SiweMessage(JSON.parse(message || '{}'));
        const nextAuthUrl = new URL(getNextAppURL());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nonce = await getCsrfToken({ req: { headers: req.headers } });
        const result = await siwe.verify({
          signature: signature || '',
          domain: nextAuthUrl.host,
          nonce,
        });
        if (result.success) {
          return await handleUser({
            address,
            email,
          });
        } else throw new Error('Invalid signature');
      } catch (error) {
        console.error({ error });
        return null;
      }
    },
  });
