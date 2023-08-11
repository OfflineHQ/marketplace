import NextAuth from 'next-auth';

import { authOptions } from '@next/next-auth/options';

// @see ./lib/auth
export default NextAuth(authOptions);
