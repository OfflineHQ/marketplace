import { createOptions } from '@next/next-auth/options';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest, res: NextResponse) => {
  return NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    createOptions(req)
  );
};

export { handler as GET, handler as POST };
