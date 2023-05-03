// https://docs.login.xyz/integrations/nextauth.js
import { getNextAppURL } from '@client/next-auth/common';
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
      logger.debug({ credentials, req });
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
      console.log({ result, siwe });
      if (result.success) {
        return {
          id: siwe.address,
          address: siwe.address,
          chainId: siwe.chainId,
        };
      } else throw new Error('Invalid signature');
    },
  });
