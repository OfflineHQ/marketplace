/// <reference types="next-auth" />

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  interface User {
    id: string;
    // crypto wallet address
    address: string;
    chainId: number;
  }

  interface Session {
    user: User;
  }
}

export {};
