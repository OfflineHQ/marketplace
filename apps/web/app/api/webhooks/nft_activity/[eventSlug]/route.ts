import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
}
