import { AlchemyWrapper } from '@indexer/alchemy/admin';
// import { adminSdk } from '@gql/admin/api';
import { getNextAppURL } from '@utils';

const alchemy = new AlchemyWrapper();

type CreateNftActivityWebhook = {
  nftCollectionAddress: string;
};

export const createNftActivityWebhookForEvent = async ({
  nftCollectionAddress,
}: CreateNftActivityWebhook) => {
  return await alchemy.createNftActivityWebhook(
    `${getNextAppURL()}/api/webhooks/nft_activity/${nftCollectionAddress}`,
    [{ contractAddress: nftCollectionAddress }]
  );
};
