import type { JWT } from 'next-auth/jwt';
export declare const getJwt: ({
  raw,
}: {
  raw: boolean;
}) => Promise<JWT | string>;
