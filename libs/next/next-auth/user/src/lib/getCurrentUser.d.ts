import type { AppUser } from '@next/types';
export declare const getUnauthenticatedUserCookie: () => Promise<
  string | undefined
>;
export declare const handleUnauthenticatedUser: () => Promise<string>;
export declare const getCurrentUser: () => Promise<AppUser | undefined>;
