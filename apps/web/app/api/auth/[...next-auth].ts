import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// eslint-disable-next-line import/no-unresolved
import { SSXNextAuth } from '@spruceid/ssx-react/next-auth/backend';
import { SSXServer } from '@spruceid/ssx-server';
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const ssxConfig = {};
  const ssx = new SSXServer(ssxConfig);
  const { credentials, authorize } = SSXNextAuth(req, ssx);
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials,
      authorize,
    }),
  ];
  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      session: (sessionData) => {
        const { session, user, token } = sessionData;
        if (session.user) {
          // session.user.name = token.sub;
        }
        return session;
      },
    },
  });
}
