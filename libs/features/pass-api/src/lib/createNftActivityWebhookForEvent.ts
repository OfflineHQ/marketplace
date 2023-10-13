import env from '@env/server';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { NftWebhookParams } from '@indexer/alchemy/types';

const alchemy = new AlchemyWrapper();

type CreateNftActivityWebhook = {
  eventId: string;
  nftCollectionAddresses: NftWebhookParams['filters'];
};

export const createNftActivityWebhookForEvent = async ({
  eventId,
  nftCollectionAddresses,
}: CreateNftActivityWebhook) => {
  const wepAppUrl = env.WEB_APP_URL;
  return alchemy.createNftActivityWebhook(
    `${wepAppUrl}/api/webhooks/nft_activity/${eventId}`,
    nftCollectionAddresses
  );
};
