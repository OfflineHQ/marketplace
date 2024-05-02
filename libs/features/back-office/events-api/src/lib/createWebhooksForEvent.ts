import env from '@env/server';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { NftFilter } from 'alchemy-sdk';

type CreateWebhooks = {
  eventId: string;
  nftCollectionAddresses: NftFilter[];
  createActivityWebhook?: boolean;
  createMetadataUpdateWebhook?: boolean;
};

export const createWebhooksForEvent = async (
  {
    eventId,
    nftCollectionAddresses,
    createActivityWebhook = true,
    createMetadataUpdateWebhook = false,
  }: CreateWebhooks,
  alchemy = new AlchemyWrapper(),
) => {
  const webAppUrl = env.WEB_APP_URL;
  const webhooks = await Promise.all([
    createActivityWebhook
      ? alchemy.createNftActivityWebhook(
          `${webAppUrl}api/webhooks/pass-nft-activity/${eventId}`,
          nftCollectionAddresses,
        )
      : null,
    createMetadataUpdateWebhook
      ? alchemy.createNftMetadataUpdateWebhook(
          `${webAppUrl}api/webhooks/pass-nft-metadata-update/${eventId}`,
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

export const updateWebhooksForEvent = async (
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
