import NextAuth from 'next-auth';

import { authOptions } from '@client/next-auth/options';

// @see ./lib/auth
export default NextAuth(authOptions);
