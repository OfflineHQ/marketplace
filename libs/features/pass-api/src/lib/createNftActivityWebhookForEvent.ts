import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { getNextAppURL } from '@utils';

const alchemy = new AlchemyWrapper();

type CreateNftActivityWebhook = {
  eventId: string;
  nftCollectionAddresses: string[];
};

export const createNftActivityWebhookForEvent = async ({
  eventId,
  nftCollectionAddresses,
}: CreateNftActivityWebhook) => {
  return alchemy.createNftActivityWebhook(
    `${getNextAppURL()}/api/webhooks/nft_activity/${eventId}`,
    nftCollectionAddresses.map((contractAddress) => ({ contractAddress }))
  );
};
