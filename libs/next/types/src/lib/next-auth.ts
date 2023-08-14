/// <reference types="next-auth" />

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
  tagPermissions: {
    write: string[];
  };
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    access?: Access;
  }
}

// Extend the JWT type
declare module 'next-auth' {
  interface User {
    id: string;
    // crypto wallet address
    address: string;
    email?: string;
    isOrganizer: boolean;
  }

  interface Session {
    user: User;
  }
}

export {};
