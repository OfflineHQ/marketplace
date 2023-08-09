// eslint-disable-next-line import/no-unresolved
import '@next/types';

import * as jsonwebtoken from 'jsonwebtoken';
import type { NextAuthOptions, User, Account } from 'next-auth';
import type { JWTOptions, JWT } from 'next-auth/jwt';

import { SiweProvider } from '@next/siwe/provider';
import { Roles } from '@next/hasura/utils';
import { isProd, getNextAppURL } from '@utils';
import { Provider } from 'next-auth/providers';
import { nextAuthCookieName } from '@next/next-auth/common';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

// const refreshAccessToken = async (token: JWT) => {
//   return token;
// };

export const jwtOptions: JWTOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  maxAge: parseInt(process.env.TOKEN_LIFE_TIME as string) || 30 * 24 * 60 * 60, // 30 days
  encode: async ({ secret, token: payload }) =>
    jsonwebtoken.sign(payload!, secret, {
      algorithm: 'RS256',
    }),
  decode: async ({ secret, token }) => {
    const decodedToken = jsonwebtoken.verify(token!, secret, {
      algorithms: ['RS256'],
    });
    // run some checks on the returned payload, perhaps you expect some specific values

    // if its all good, return it, or perhaps just return a boolean
    return decodedToken as JWT;
  },
};

export const providers: Array<Provider> = [SiweProvider()];

// Authorize cookie for hasura app https://github.com/nextauthjs/next-auth/issues/405#issuecomment-737593528
const hostName = new URL(getNextAppURL()).hostname;
const useSecureCookies = getNextAppURL().startsWith('https://');

export const authOptions = {
  cookies: {
    sessionToken: {
      name: nextAuthCookieName(),
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        // authorize cookie for subdomain, inc. hasura app (strip www. from hostName)
        domain:
          hostName === 'localhost' || !hostName
            ? hostName
            : '.' + hostName.replace(/^www\./, ''),
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge:
      parseInt(process.env.TOKEN_LIFE_TIME as string) || 30 * 24 * 60 * 60, // 30 days
  },
  debug: !isProd(),
  providers,
  pages: {
    signIn: undefined,
    signOut: undefined,
    newUser: undefined,
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  theme: {
    colorScheme: 'auto',
  },
  jwt: jwtOptions,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Add hasura data needed for claims_map + accessToken
    async jwt(args) {
      const {
        token,
        user,
        account,
      }: {
        token: JWT;
        user?: User;
        account?: Account | null;
      } = args;

      // User is connected, set the role for Hasura + Upload.js permissions to secure access to the user's pass
      if (user && account) {
        token.access = {
          pathPermissions: [
            {
              match: {
                path: `/${process.env.UPLOAD_PATH_PREFIX}/${process.env.UPLOAD_PATH_ENTITY_FOLDER}/${user.address}`,
                scope: 'Children',
              },
              permissions: {
                read: {
                  file: {
                    downloadFile: ['*'],
                    getFileDetails: true,
                  },
                },
                write: {
                  file: {
                    createFile: false,
                    deleteFile: false,
                    overwriteFile: false,
                  },
                },
              },
            },
          ],
          tagPermissions: {
            write: [''],
          },
        };

        return {
          user,
          provider: account.provider,
          providerType: account.type,
          role: Roles.user,
          access: token.access,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // needed for hasura claims_map
      session.user = token.user as User;
      return session;
    },
  },
} satisfies NextAuthOptions;
