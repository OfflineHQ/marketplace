'use server';

import env from '@env/server';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import { NftFilter } from 'alchemy-sdk';

type CreateWebhooks = {
  loyaltyCardId: string;
  nftCollectionAddresses: NftFilter[];
  createActivityWebhook?: boolean;
  createMetadataUpdateWebhook?: boolean;
};

export const createWebhooksForLoyaltyCard = async (
  {
    loyaltyCardId,
    nftCollectionAddresses,
    createActivityWebhook = true,
    createMetadataUpdateWebhook = true,
  }: CreateWebhooks,
  alchemy = new AlchemyWrapper(),
) => {
  const webAppUrl = env.WEB_APP_URL;
  const webhooks = await Promise.all([
    createActivityWebhook
      ? alchemy.createNftActivityWebhook(
          `${webAppUrl}api/webhooks/loyalty-card-nft-activity/${loyaltyCardId}`,
          nftCollectionAddresses,
        )
      : null,
    createMetadataUpdateWebhook
      ? alchemy.createNftMetadataUpdateWebhook(
          `${webAppUrl}api/webhooks/loyalty-card-nft-metadata-update/${loyaltyCardId}`,
          nftCollectionAddresses,
        )
      : null,
  ]);
  return {
    activityWebhook: webhooks[0],
    metadataUpdateWebhook: webhooks[1],
  };
};

type UpdateWebhooks = {
  activityWebhookId?: string;
  metadataUpdateWebhookId?: string;
  nftCollectionAddresses: NftFilter[];
};

export const updateWebhooksForLoyaltyCard = async (
  {
    activityWebhookId,
    metadataUpdateWebhookId,
    nftCollectionAddresses,
  }: UpdateWebhooks,
  alchemy = new AlchemyWrapper(),
) => {
  return Promise.all([
    activityWebhookId
      ? alchemy.addContractAddressToWebhook(
          activityWebhookId,
          nftCollectionAddresses,
        )
      : null,
    metadataUpdateWebhookId
      ? alchemy.addContractAddressToWebhook(
          metadataUpdateWebhookId,
          nftCollectionAddresses,
        )
      : null,
  ]);
};
