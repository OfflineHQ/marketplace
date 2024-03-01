import { adminSdk } from '@gql/admin/api';
import { AlchemyNFTActivityEvent } from '@indexer/alchemy/types';
import { Network, WebhookType } from 'alchemy-sdk';
import { extractLoyaltyCardMintFromEvent } from './loyaltyCardActivity';
import { processNftActivities } from './utils';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetLoyaltyCardAlchemyEvent: jest.fn(),
  },
}));

jest.mock('./utils', () => ({
  processNftActivities: jest.fn(),
}));

jest.mock('@indexer/alchemy/admin', () => ({
  AlchemyWrapper: jest.fn().mockImplementation(() => ({
    convertNetworkToChainId: jest.fn().mockReturnValue('1'),
  })),
}));

describe('extractLoyaltyCardMintFromEvent', () => {
  const mockEvent: AlchemyNFTActivityEvent = {
    webhookId: 'webhookId',
    id: 'id',
    createdAt: new Date(),
    type: WebhookType.NFT_ACTIVITY,
    event: {
      network: Network.ETH_MAINNET,
      activity: [],
    },
  };

  it('should correctly extract loyalty card mint from event', async () => {
    const mockProcessedActivities = [
      {
        fromAddress: '0x1',
        toAddress: '0x2',
        contractAddress: '0xcontract',
        tokenId: '1',
      },
    ];
    (processNftActivities as jest.Mock).mockReturnValue(
      mockProcessedActivities,
    );

    (adminSdk.GetLoyaltyCardAlchemyEvent as jest.Mock).mockResolvedValue({
      loyaltyCardNft: [{ id: '1', ownerAddress: '0x1' }],
    });

    const result = await extractLoyaltyCardMintFromEvent(mockEvent);

    expect(result).toEqual([
      {
        _set: {
          ownerAddress: '0x2',
          status: 'COMPLETED',
        },
        where: {
          id: {
            _eq: '1',
          },
        },
      },
    ]);
  });

  it('should skip processing for minting events from the zero address', async () => {
    const mockProcessedActivities = [
      {
        fromAddress: '0x0000000000000000000000000000000000000000',
        toAddress: '0x2',
        contractAddress: '0xcontract',
        tokenId: '1',
      },
    ];
    (processNftActivities as jest.Mock).mockReturnValue(
      mockProcessedActivities,
    );

    const result = await extractLoyaltyCardMintFromEvent(mockEvent);
    expect(result).toEqual([]);
  });

  it('should return an empty array if no loyalty card NFTs are found', async () => {
    const mockProcessedActivities = [
      {
        fromAddress: '0x1',
        toAddress: '0x2',
        contractAddress: '0xcontract',
        tokenId: '1',
      },
    ];
    (processNftActivities as jest.Mock).mockReturnValue(
      mockProcessedActivities,
    );

    (adminSdk.GetLoyaltyCardAlchemyEvent as jest.Mock).mockResolvedValue({
      loyaltyCardNft: [],
    });

    const result = await extractLoyaltyCardMintFromEvent(mockEvent);
    expect(result).toEqual([]);
  });

  it('should handle multiple activities correctly', async () => {
    const mockProcessedActivities = [
      {
        fromAddress: '0x1',
        toAddress: '0x2',
        contractAddress: '0xcontract1',
        tokenId: '1',
      },
      {
        fromAddress: '0x3',
        toAddress: '0x4',
        contractAddress: '0xcontract2',
        tokenId: '2',
      },
    ];
    (processNftActivities as jest.Mock).mockReturnValue(
      mockProcessedActivities,
    );

    (adminSdk.GetLoyaltyCardAlchemyEvent as jest.Mock)
      .mockResolvedValueOnce({
        loyaltyCardNft: [{ id: '1', ownerAddress: '0x2' }],
      })
      .mockResolvedValueOnce({
        loyaltyCardNft: [{ id: '2', ownerAddress: '0x4' }],
      });

    const result = await extractLoyaltyCardMintFromEvent(mockEvent);
    expect(result).toEqual([
      {
        _set: {
          ownerAddress: '0x2',
          status: 'COMPLETED',
        },
        where: {
          id: {
            _eq: '1',
          },
        },
      },
      {
        _set: {
          ownerAddress: '0x4',
          status: 'COMPLETED',
        },
        where: {
          id: {
            _eq: '2',
          },
        },
      },
    ]);
  });

  it('should handle errors during loyalty card NFT fetching gracefully', async () => {
    const mockProcessedActivities = [
      {
        fromAddress: '0x1',
        toAddress: '0x2',
        contractAddress: '0xcontract',
        tokenId: '1',
      },
    ];
    (processNftActivities as jest.Mock).mockReturnValue(
      mockProcessedActivities,
    );

    (adminSdk.GetLoyaltyCardAlchemyEvent as jest.Mock).mockRejectedValue(
      new Error('Test Error'),
    );

    await expect(extractLoyaltyCardMintFromEvent(mockEvent)).resolves.toEqual(
      [],
    );
  });
});
