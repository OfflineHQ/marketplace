// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    access_token?: string;
  }

  interface Session {
    // crypto wallet address
    address: string;
    error: string;
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
