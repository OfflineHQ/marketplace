import { adminSdk } from '@gql/admin/api';
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
  console.log(signature);
  return calculatedSignature === signature;
}

async function getOfflineApiKeyForShop(shop: string) {
  // const apiKey = adminSdk.getApiKeyForShop(shop);
  return shop; //switch to apiKey
}

export async function GET(req: NextRequest, { params: { contractAddress } }) {
  const searchParams = req.nextUrl.searchParams;

  for (const [key, value] of searchParams) {
    console.log(`${key}: ${value}`);
  }
  if (!verifySignature(req.nextUrl.searchParams, SHARED_SECRET)) {
    return new NextResponse('Invalid signature', { status: 403 });
  }
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress)
    return new NextResponse('Wallet address is required', { status: 400 });

  try {
    const response =
      await adminSdk.GetEventPassNftFromContractAndOwnerAddresses({
        contractAddress,
        walletAddress,
      });

    const nft = response.eventPassNft[0];

    return new NextResponse(JSON.stringify(nft), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-offline-api-key': await getOfflineApiKeyForShop('test-shop'),
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

export async function POST(req: NextRequest, { params: { contractAddress } }) {
  console.log('Wow');
  const body = await req.json();
  const searchParams = new URLSearchParams(Object.entries(body));

  if (!verifySignature(searchParams, SHARED_SECRET)) {
    return new NextResponse('Invalid signature', { status: 403 });
  }
  const { walletAddress, password } = body;

  if (!walletAddress || !password) {
    return new NextResponse(
      JSON.stringify({ message: 'Wallet address and password are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    // mint with password
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-offline-api-key': await getOfflineApiKeyForShop('test-shop'),
      },
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return new NextResponse(
      JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
