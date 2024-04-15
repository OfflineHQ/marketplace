import { adminSdk } from '@gql/admin/api';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
  deleteTables,
} from '@test-utils/db';
import { handler } from './loyalty-card-cron';

jest
  .spyOn(adminSdk, 'GetLoyaltyCardByContractAddressForProcess')
  .mockImplementation(jest.fn());

const multicallClaimMock = jest.fn();
jest.mock('@nft/thirdweb-admin', () => ({
  LoyaltyCardNft: jest.fn().mockImplementation(() => ({
    multicallClaim: multicallClaimMock,
  })),
}));

jest.mock('@thirdweb-dev/sdk', () => {
  return {
    ThirdwebSDK: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe('handler', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'loyaltyCardNft',
      'loyaltyCardNftContract',
      'minterTemporaryWallet',
    ]);
  });

  afterAll(async () => {
    await deleteTables(client, [
      'loyaltyCardNft',
      'loyaltyCardNftContract',
      'minterTemporaryWallet',
    ]);
    await client.end();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    multicallClaimMock.mockClear();
  });

  it('one contract one nft', async () => {
    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: [
        {
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          error: null,
          tokenUri: 'ipfs://example1',
          chainId: '1',
          loyaltyCardId: 'loyaltyCardId1',
          organizerId: 'organizerId1',
          ownerAddress: '0xOwnerAddress1',
          status: 'CONFIRMED',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
      ],
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        }),
      ]),
    );
  });

  it('one contract two nfts', async () => {
    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: [
        {
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
      ],
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
        }),
        expect.objectContaining({
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
        }),
      ]),
    );
  });

  it('one contract multiple nfts', async () => {
    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: [
        {
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '3',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '3',
          metadata:
            '{"name": "Loyalty Card NFT #3", "description": "Third NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '4',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '4',
          metadata:
            '{"name": "Loyalty Card NFT #4", "description": "Fourth NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '5',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '5',
          metadata:
            '{"name": "Loyalty Card NFT #5", "description": "Fifth NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '6',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '6',
          metadata:
            '{"name": "Loyalty Card NFT #6", "description": "Sixth NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '7',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '7',
          metadata:
            '{"name": "Loyalty Card NFT #7", "description": "Seventh NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
      ],
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
        }),
        expect.objectContaining({
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
        }),
        expect.objectContaining({
          id: '3',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '3',
          metadata:
            '{"name": "Loyalty Card NFT #3", "description": "Third NFT"}',
        }),
        expect.objectContaining({
          id: '4',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '4',
          metadata:
            '{"name": "Loyalty Card NFT #4", "description": "Fourth NFT"}',
        }),
        expect.objectContaining({
          id: '5',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '5',
          metadata:
            '{"name": "Loyalty Card NFT #5", "description": "Fifth NFT"}',
        }),
        expect.objectContaining({
          id: '6',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '6',
          metadata:
            '{"name": "Loyalty Card NFT #6", "description": "Sixth NFT"}',
        }),
        expect.objectContaining({
          id: '7',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '7',
          metadata:
            '{"name": "Loyalty Card NFT #7", "description": "Seventh NFT"}',
        }),
      ]),
    );
  });

  it('two contract one nft each', async () => {
    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: [
        {
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
          loyaltyCardId: 'loyaltyCardId2',
        },
      ],
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledTimes(2);
    expect(multicallClaimMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
        }),
      ]),
    );

    expect(multicallClaimMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
        }),
      ]),
    );
  });

  it('two contracts multiple nfts each', async () => {
    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: [
        {
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '3',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '3',
          metadata:
            '{"name": "Loyalty Card NFT #3", "description": "Third NFT"}',
          loyaltyCardId: 'loyaltyCardId1',
        },
        {
          id: '4',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '4',
          metadata:
            '{"name": "Loyalty Card NFT #4", "description": "Fourth NFT"}',
          loyaltyCardId: 'loyaltyCardId2',
        },
        {
          id: '5',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '5',
          metadata:
            '{"name": "Loyalty Card NFT #5", "description": "Fifth NFT"}',
          loyaltyCardId: 'loyaltyCardId2',
        },
        {
          id: '6',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '6',
          metadata:
            '{"name": "Loyalty Card NFT #6", "description": "Sixth NFT"}',
          loyaltyCardId: 'loyaltyCardId2',
        },
        {
          id: '7',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '7',
          metadata:
            '{"name": "Loyalty Card NFT #7", "description": "Seventh NFT"}',
          loyaltyCardId: 'loyaltyCardId2',
        },
      ],
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledTimes(2);
    expect(multicallClaimMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
        }),
        expect.objectContaining({
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
        }),
        expect.objectContaining({
          id: '3',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '3',
          metadata:
            '{"name": "Loyalty Card NFT #3", "description": "Third NFT"}',
        }),
      ]),
    );

    expect(multicallClaimMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: '4',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '4',
          metadata:
            '{"name": "Loyalty Card NFT #4", "description": "Fourth NFT"}',
        }),
        expect.objectContaining({
          id: '5',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '5',
          metadata:
            '{"name": "Loyalty Card NFT #5", "description": "Fifth NFT"}',
        }),
        expect.objectContaining({
          id: '6',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '6',
          metadata:
            '{"name": "Loyalty Card NFT #6", "description": "Sixth NFT"}',
        }),
        expect.objectContaining({
          id: '7',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '7',
          metadata:
            '{"name": "Loyalty Card NFT #7", "description": "Seventh NFT"}',
        }),
      ]),
    );
  });

  function generateNFTs() {
    const nfts = [];
    let nftId = 1;
    const nftsPerContract = [10, 15, 20, 25];

    for (let contractIndex = 1; contractIndex <= 4; contractIndex++) {
      const contractAddress = `0xLoyaltyCardContractAddress${contractIndex}`;
      const loyaltyCardId = `loyaltyCardId${contractIndex}`;
      const numNFTs = nftsPerContract[contractIndex - 1];

      for (let i = 0; i < numNFTs; i++) {
        nfts.push({
          id: `${nftId}`,
          contractAddress,
          tokenId: `${nftId}`,
          metadata: `{"name": "Loyalty Card NFT #${nftId}", "description": "Description for NFT #${nftId}"}`,
          loyaltyCardId,
        });
        nftId++;
      }
    }
    return nfts;
  }

  it('four contracts with multiple nfts each', async () => {
    const generatedNFTs = generateNFTs();

    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: generatedNFTs,
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledTimes(4);

    const nftsPerContract = [10, 15, 20, 25];
    let expectedCallIndex = 1;

    nftsPerContract.forEach((numNFTs, index) => {
      const contractAddress = `0xLoyaltyCardContractAddress${index + 1}`;
      const expectedNFTsForContract = generatedNFTs
        .filter((nft) => nft.contractAddress === contractAddress)
        .map((nft) =>
          expect.objectContaining({
            id: nft.id,
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId,
            metadata: nft.metadata,
          }),
        );

      expect(multicallClaimMock).toHaveBeenNthCalledWith(
        expectedCallIndex,
        expect.anything(),
        expect.arrayContaining(expectedNFTsForContract),
      );

      expectedCallIndex++;
    });
  });
});
