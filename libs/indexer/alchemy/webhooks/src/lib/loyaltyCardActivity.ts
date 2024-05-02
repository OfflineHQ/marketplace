import { GetAlchemyInfosFromLoyaltyCardId } from '@features/loyalty-card-api';
import { adminSdk } from '@gql/admin/api';
import { LoyaltyCardNft_Updates, NftStatus_Enum } from '@gql/shared/types';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { WebhookType } from 'alchemy-sdk';
import { headers } from 'next/headers';
import {
  addAlchemyContextToRequest,
  isValidSignatureForAlchemyRequest,
  processNftActivities,
} from './utils';

const alchemy = new AlchemyWrapper();

export const extractLoyaltyCardMintFromEvent = async (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
) => {
  const loyaltyCardNfts: LoyaltyCardNft_Updates[] = [];
  try {
    const processedActivities = processNftActivities(alchemyWebhookEvent);
    const network = alchemyWebhookEvent.event.network;

    for (const {
      fromAddress,
      toAddress,
      contractAddress,
      tokenId,
    } of processedActivities) {
      if (fromAddress === '0x0000000000000000000000000000000000000000') {
        continue;
      }
      const loyaltyCardNftResponse = await adminSdk.GetLoyaltyCardAlchemyEvent({
        tokenId,
        contractAddress,
        chainId: alchemy.convertNetworkToChainId(network).toString(),
      });

      if (
        !loyaltyCardNftResponse.loyaltyCardNft ||
        loyaltyCardNftResponse.loyaltyCardNft.length === 0
      ) {
        continue;
      }

      const loyaltyCardNft = loyaltyCardNftResponse.loyaltyCardNft[0];

      loyaltyCardNfts.push({
        _set: {
          ownerAddress: toAddress,
          status: NftStatus_Enum.Completed,
        },
        where: {
          id: {
            _eq: loyaltyCardNft.id,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error fetching loyalty card NFT:', error);
    return [];
  }

  return loyaltyCardNfts;
};

export async function loyaltyCardActivity(
  req: AlchemyRequest,
  loyaltyCardId: string,
) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  const params = await GetAlchemyInfosFromLoyaltyCardId({
    loyaltyCardId: loyaltyCardId,
  });
  const activityWebhookSigningKey = params.activityWebhookSigningKey;
  if (
    !activityWebhookSigningKey ||
    !isValidSignatureForAlchemyRequest(req, activityWebhookSigningKey)
  ) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }
  const alchemyWebhookEvent: AlchemyNFTActivityEvent = JSON.parse(body);

  if (alchemyWebhookEvent.type !== WebhookType.NFT_ACTIVITY) {
    return new Response('Invalid webhook type. Expected NFT_ACTIVITY.', {
      status: 400,
    });
  }

  const loyaltyCardsMintFromEvent =
    await extractLoyaltyCardMintFromEvent(alchemyWebhookEvent);
  if (loyaltyCardsMintFromEvent.length) {
    try {
      await adminSdk.UpdateLoyaltyCardNfts({
        updates: loyaltyCardsMintFromEvent,
      });
    } catch (e) {
      console.error(e);
      return new Response('Error processing loyalty cards mint', {
        status: 500,
      });
    }
  } else {
    return new Response('No loyalty cards mint found in event', {
      status: 500,
    });
  }
  return new Response(null, { status: 200 });
}
