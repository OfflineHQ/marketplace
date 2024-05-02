import '@next/types';
import type { Account } from 'next-auth';
import type { JWT, JWTOptions } from 'next-auth/jwt';
import { Provider } from 'next-auth/providers';
export declare const jwtOptions: JWTOptions;
export declare const providers: Array<Provider>;
export declare const createOptions: () => {
  cookies: {
    sessionToken: {
      name: string;
      options: {
        httpOnly: true;
        sameSite: 'lax';
        path: string;
        secure: boolean;
        domain: string;
      };
    };
  };
  session: {
    strategy: 'jwt';
    maxAge: number;
  };
  debug: boolean;
  providers: Provider[];
  pages: {
    signIn: undefined;
    signOut: undefined;
    newUser: undefined;
  };
  theme: {
    colorScheme: 'auto';
  };
  jwt: JWTOptions;
  secret: string;
  callbacks: {
    jwt(args: {
      token: JWT;
      user: import('next-auth').User | import('next-auth/adapters').AdapterUser;
      account: Account | null;
      profile?: import('next-auth').Profile | undefined;
      trigger?: 'signIn' | 'signUp' | 'update' | undefined;
      isNewUser?: boolean | undefined;
      session?: any;
    }): Promise<
      | JWT
      | {
          user: {
            email: string | undefined;
            phone: string | undefined;
            kyc:
              | Pick<
                  import('@gql/shared/types').Kyc,
                  'applicantId' | 'reviewStatus' | 'levelName'
                >
              | undefined;
            role: import('dist/libs/roles/types/src').Role | undefined;
            roles: import('dist/libs/roles/types/src').Role[] | undefined;
            id: string;
            address: string;
            organizerId?: string | undefined;
            clientId?: string | undefined;
          };
          access:
            | {
                pathPermissions: {
                  match: {
                    path: string;
                    scope: string;
                  };
                  permissions: {
                    read: {
                      file: {
                        downloadFile: string[];
                        getFileDetails: boolean;
                      };
                    };
                    write: {
                      file: {
                        createFile: boolean;
                        deleteFile: boolean;
                        overwriteFile: boolean;
                      };
                    };
                  };
                }[];
              }
            | undefined;
          clientId: string;
          name?: string | null | undefined;
          email?: string | null | undefined;
          picture?: string | null | undefined;
          sub?: string | undefined;
        }
      | {
          user: {
            email: string | undefined;
            phone: string | undefined;
            kyc:
              | Pick<
                  import('@gql/shared/types').Kyc,
                  'applicantId' | 'reviewStatus' | 'levelName'
                >
              | undefined;
            id: string;
            address: string;
            organizerId?: string | undefined;
            clientId?: string | undefined;
            role?: import('dist/libs/roles/types/src').Role | undefined;
            roles?: import('dist/libs/roles/types/src').Role[] | undefined;
          };
          access:
            | {
                pathPermissions: {
                  match: {
                    path: string;
                    scope: string;
                  };
                  permissions: {
                    read: {
                      file: {
                        downloadFile: string[];
                        getFileDetails: boolean;
                      };
                    };
                    write: {
                      file: {
                        createFile: boolean;
                        deleteFile: boolean;
                        overwriteFile: boolean;
                      };
                    };
                  };
                }[];
              }
            | undefined;
          name?: string | null | undefined;
          email?: string | null | undefined;
          picture?: string | null | undefined;
          sub?: string | undefined;
        }
    >;
    session({
      session,
      token,
    }: {
      session: import('next-auth').Session;
      token: JWT;
      user: import('next-auth/adapters').AdapterUser;
    } & {
      newSession: any;
      trigger: 'update';
    }): Promise<import('next-auth').Session>;
  };
};
