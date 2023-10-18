import env from '@env/server';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { NftFilter } from 'alchemy-sdk';

const alchemy = new AlchemyWrapper();

type CreateNftActivityWebhook = {
  eventId: string;
  nftCollectionAddresses: NftFilter[];
};

export const createNftActivityWebhookForEvent = async ({
  eventId,
  nftCollectionAddresses,
}: CreateNftActivityWebhook) => {
  const wepAppUrl = env.WEB_APP_URL;
  return alchemy.createNftActivityWebhook(
    `${wepAppUrl}/api/webhooks/nft_activity/${eventId}`,
    nftCollectionAddresses,
  );
};

type UpdateNftActivityWebhook = {
  webhookId: string;
  nftCollectionAddresses: NftFilter[];
};

export const updateNftActivityWebhook = async ({
  webhookId,
  nftCollectionAddresses,
}: UpdateNftActivityWebhook) => {
  return alchemy.addAddressNftActivityWebhook(
    webhookId,
    nftCollectionAddresses,
  );
};
