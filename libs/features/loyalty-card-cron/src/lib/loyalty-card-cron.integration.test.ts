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

  beforeEach(async () => {
    jest.clearAllMocks();
    multicallClaimMock.mockClear();
    await deleteTables(client, [
      'loyaltyCardNft',
      'loyaltyCardNftContract',
      'minterTemporaryWallet',
    ]);
    await applySeeds(client, [
      'loyaltyCardNft',
      'loyaltyCardNftContract',
      'minterTemporaryWallet',
    ]);
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

    const expectedCalls = [
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          contractAddress: '0xLoyaltyCardContractAddress1',
          tokenId: '1',
          metadata:
            '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
        }),
      ]),
      expect.arrayContaining([
        expect.objectContaining({
          id: '2',
          contractAddress: '0xLoyaltyCardContractAddress2',
          tokenId: '2',
          metadata:
            '{"name": "Loyalty Card NFT #2", "description": "Second NFT"}',
        }),
      ]),
    ];

    expectedCalls.forEach((call, index) => {
      expect(multicallClaimMock).toHaveBeenNthCalledWith(
        index + 1,
        expect.anything(),
        call,
      );
    });
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

    // Ensure the mock function was called
    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();

    // Aggregate all calls into a single array
    const allCallsArgs = multicallClaimMock.mock.calls.flatMap(
      (call) => call[1],
    );

    // Define the expected calls
    const expectedCalls = [
      expect.objectContaining({
        id: '1',
        contractAddress: '0xLoyaltyCardContractAddress1',
        tokenId: '1',
        metadata: '{"name": "Loyalty Card NFT #1", "description": "First NFT"}',
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
        metadata: '{"name": "Loyalty Card NFT #3", "description": "Third NFT"}',
      }),
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
        metadata: '{"name": "Loyalty Card NFT #5", "description": "Fifth NFT"}',
      }),
      expect.objectContaining({
        id: '6',
        contractAddress: '0xLoyaltyCardContractAddress2',
        tokenId: '6',
        metadata: '{"name": "Loyalty Card NFT #6", "description": "Sixth NFT"}',
      }),
      expect.objectContaining({
        id: '7',
        contractAddress: '0xLoyaltyCardContractAddress2',
        tokenId: '7',
        metadata:
          '{"name": "Loyalty Card NFT #7", "description": "Seventh NFT"}',
      }),
    ];

    expectedCalls.forEach((expectedCall) => {
      expect(allCallsArgs).toEqual(expect.arrayContaining([expectedCall]));
    });
  });

  function generateNFTs(numberOfContracts: number) {
    const nfts = [];
    let nftId = 1;

    for (
      let contractIndex = 1;
      contractIndex <= numberOfContracts;
      contractIndex++
    ) {
      const contractAddress = `0xLoyaltyCardContractAddress${contractIndex}`;
      const loyaltyCardId = `loyaltyCardId${contractIndex}`;
      const numNFTs = Math.floor(Math.random() * 10) + 1;

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

  it('random number of contracts with random nfts each', async () => {
    const numberOfContracts = Math.floor(Math.random() * 5) + 4;
    const generatedNFTs = generateNFTs(numberOfContracts);

    (
      adminSdk.GetLoyaltyCardByContractAddressForProcess as jest.Mock
    ).mockResolvedValue({
      loyaltyCardNft: generatedNFTs,
    });

    await handler();

    expect(
      adminSdk.GetLoyaltyCardByContractAddressForProcess,
    ).toHaveBeenCalled();
    expect(multicallClaimMock).toHaveBeenCalledTimes(numberOfContracts);
  });
});
