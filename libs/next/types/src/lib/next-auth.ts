/// <reference types="next-auth" />

import type { Kyc } from '@gql/shared/types';
import type { Role } from '@roles/types';
import { DefaultJWT } from 'next-auth/jwt';

// Define your additional types here
interface PathMatch {
  path: string;
  scope: string;
}

interface FilePermissions {
  downloadFile: string[];
  getFileDetails: boolean;
}

interface WritePermissions {
  file: {
    createFile: boolean;
    deleteFile: boolean;
    overwriteFile: boolean;
  };
}

interface Permissions {
  read: {
    file: FilePermissions;
  };
  write: WritePermissions;
}

interface PathPermission {
  match: PathMatch;
  permissions: Permissions;
}

interface Access {
  pathPermissions: PathPermission[];
  tagPermissions?: {
    write: string[];
  };
}

export interface AppUser {
  id: string;
  // crypto wallet address
  address: string;
  email?: string;
  phone?: string;
  organizerId?: string;
  clientId?: string;
  kyc?: Pick<Kyc, 'applicantId' | 'reviewStatus' | 'levelName'>;
  role?: Role;
  roles?: Role[];
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    access?: Access | null;
    user: AppUser;
  }
}

// Extend the JWT type
declare module 'next-auth' {
  interface User extends AppUser {
    email?: string;
  }

  interface Session {
    user: AppUser;
  }
}

export {};
