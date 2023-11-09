import {
  Activity,
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { Network, WebhookType } from 'alchemy-sdk';

export function createMockAlchemyRequest(
  nftActivities: Activity[],
): AlchemyRequest {
  const mockAlchemyRequest: AlchemyNFTActivityEvent = {
    webhookId: 'webhookId',
    id: 'id',
    createdAt: new Date(),
    type: WebhookType.NFT_ACTIVITY,
    event: {
      network: Network.ETH_GOERLI,
      activity: nftActivities,
    },
  };
  return {
    alchemy: {
      rawBody: JSON.stringify(mockAlchemyRequest),
      signature: 'mock-signature',
    },
    text: jest.fn().mockResolvedValue(JSON.stringify(mockAlchemyRequest)),
    headers: null as unknown as Headers,
  } as unknown as AlchemyRequest; // Cast to AlchemyRequest type
}
