// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    // crypto wallet address
    address: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    error: string;
    user: User;
  }
}
