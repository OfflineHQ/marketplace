import { getNextAppURL } from '@utils';
import { handleAccount } from '@features/account/api';
import type { User } from 'next-auth';
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
        const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
        console.log('getNextAppURL siwe provider', getNextAppURL());
        const nextAuthUrl = new URL(getNextAppURL());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nonce = await getCsrfToken({ req: { headers: req.headers } });
        const result = await siwe.verify({
          signature: credentials?.signature || '',
          domain: nextAuthUrl.host,
          nonce,
        });
        if (result.success) {
          try {
            // eslint-disable-next-line sonarjs/prefer-immediate-return
            const user = await handleAccount({
              address: credentials?.address || '',
              email: credentials?.email || '',
            });
            return user as User;
          } catch (error) {
            console.error({ error });
            throw new Error(error);
          }
        } else {
          const error = `Invalid signature: ${JSON.stringify(result.error)}`;
          console.error({ error });
          throw new Error(error);
        }
      } catch (error) {
        console.error({ error });
        throw new Error(error);
      }
    },
  });
