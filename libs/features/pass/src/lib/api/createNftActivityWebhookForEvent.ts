import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { getNextAppURL } from '@utils';

const alchemy = new AlchemyWrapper();

type CreateNftActivityWebhook = {
  eventSlug: string;
  nftCollectionAddress: string;
};

export const createNftActivityWebhookForEvent = async ({
  eventSlug,
  nftCollectionAddress,
}: CreateNftActivityWebhook) => {
  return await alchemy.createNftActivityWebhook(
    `${getNextAppURL()}/api/webhooks/nft_activity/${eventSlug}`,
    [{ contractAddress: nftCollectionAddress }]
  );
};
