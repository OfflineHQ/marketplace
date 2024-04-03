import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const SHARED_SECRET = '834f30785ecae86af5253ac96069e146';

function verifySignature(
  searchParams: URLSearchParams,
  sharedSecret: string,
): boolean {
  const queryHash: { [key: string]: string | string[] } = {};

  searchParams.forEach((value, key) => {
    if (key !== 'signature') {
      if (queryHash[key]) {
        if (Array.isArray(queryHash[key])) {
          queryHash[key].push(value);
        } else {
          queryHash[key] = [queryHash[key] as string, value];
        }
      } else {
        queryHash[key] = value;
      }
    }
  });

  const signature = searchParams.get('signature');
  if (!signature) {
    return false;
  }

  const sortedParams = Object.entries(queryHash)
    .map(
      ([key, value]) =>
        `${key}=${Array.isArray(value) ? value.join(',') : value}`,
    )
    .sort()
    .join('');

  const calculatedSignature = createHmac('sha256', sharedSecret)
    .update(sortedParams)
    .digest('hex');

  console.log(calculatedSignature);
  return calculatedSignature === signature;
}

export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS method called by:', request.headers.get('Origin'));
  return new NextResponse(null, {
    status: 204, // No Content
    headers: {
      'Access-Control-Allow-Origin':
        'https://quickstart-ad0cc6d3.myshopify.com', // Specify the allowed origin
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Adjust based on your needs
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Ensure to include all headers your client might send
      'Access-Control-Max-Age': '86400', // Optional: 24 hours
    },
  });
}

export async function GET(req: NextRequest) {
  const queryString = req.nextUrl.search;

  console.log('Query String:', queryString);
  // Access the searchParams from the request's URL
  const searchParams = req.nextUrl.searchParams;

  // Iterate over all search parameters and log them
  for (const [key, value] of searchParams) {
    console.log(`${key}: ${value}`);
  }

  // Create a JSON response
  const jsonResponse = JSON.stringify({ message: 'Hello World' });
  console.log(verifySignature(searchParams, SHARED_SECRET));

  return new NextResponse(jsonResponse, {
    status: 200,
    headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
  });
}
