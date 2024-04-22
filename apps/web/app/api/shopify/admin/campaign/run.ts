import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { CampaignBody, StampsCollection } from '@nft/thirdweb-organizer-stamps';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body: CampaignBody = await req.json();
  const shopDomain = req.headers.get('x-shopify-shop-domain');

  if (!shopDomain) {
    return new NextResponse(
      JSON.stringify({ error: 'Shop domain is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const organizerId = (await adminSdk.GetShopifyDomain({ domain: shopDomain }))
    .shopifyDomain[0].organizerId;

  const wallet = ethers.Wallet.createRandom();

  const shopifyBackOffice = new StampsCollection(
    ThirdwebSDK.fromPrivateKey(wallet.privateKey, env.CHAIN, {
      secretKey: env.THIRDWEB_SECRET_KEY,
      gasless: {
        openzeppelin: {
          relayerUrl: env.OPENZEPPELIN_URL,
        },
      },
    }),
  );

  try {
    const contractAddress = await shopifyBackOffice.processCampaign(
      organizerId,
      wallet,
      body,
    );

    return new NextResponse(
      JSON.stringify({
        message: 'Contract created and NFTs airdropped successfully',
        contractAddress,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error creating campaign:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
