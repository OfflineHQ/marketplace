import { adminSdk } from '@gql/admin/api';
import { Stage } from '@gql/shared/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const shopDomain = req.headers.get('x-shopify-shop-domain');

  if (!shopDomain) {
    return new NextResponse(JSON.stringify('Unauthorized'), {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  try {
    const organizerId = (
      await adminSdk.GetShopifyDomain({ domain: shopDomain })
    ).shopifyDomain[0].organizerId;
    const loyaltyCardNftContract = (
      await adminSdk.GetLoyaltyCardOrganizer({
        organizerId,
        stage: Stage.Published,
      })
    ).organizer?.loyaltyCard?.loyaltyCardNftContract;

    return NextResponse.json(
      {
        contractAddress: loyaltyCardNftContract?.contractAddress
          ? loyaltyCardNftContract.contractAddress
          : '',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to fetch loyalty card NFT contract:', error);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: 'Internal Server Error',
      },
    );
  }
}
