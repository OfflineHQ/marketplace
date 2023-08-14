import { AlchemyWrapper, fetchAllPages } from './index';
import { WebhookType } from 'alchemy-sdk';

describe('fetchAllPages', () => {
  it('should retrieve all items across multiple pages', async () => {
    const fetchPage = jest.fn().mockImplementation((pageKey?: string) => {
      if (pageKey === 'page2') {
        return Promise.resolve({ items: [3, 4], nextPageKey: 'page3' });
      } else if (pageKey === 'page3') {
        return Promise.resolve({ items: [5, 6] });
      }
      return Promise.resolve({ items: [1, 2], nextPageKey: 'page2' });
    });

    const result = await fetchAllPages(fetchPage);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should handle a single page without nextPageKey', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [1, 2] });

    const result = await fetchAllPages(fetchPage);
    expect(result).toEqual([1, 2]);
  });

  it('should not enter an infinite loop if fetchPage always returns a nextPageKey', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValue({ items: [1, 2], nextPageKey: 'next' });

    const resultPromise = fetchAllPages(fetchPage);

    // Set a 2 seconds timeout to catch infinite loop
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Infinite loop detected!')), 2000)
    );

    await expect(Promise.race([resultPromise, timeout])).rejects.toThrow(
      'Reached maximum number of fetch batches. Possible infinite loop.'
    );
  });
});

jest.mock('alchemy-sdk', () => {
  return {
    ...jest.requireActual('alchemy-sdk'),
    Alchemy: jest.fn().mockImplementation(() => ({
      nft: {
        getNftsForOwner: jest
          .fn()
          .mockImplementation(async (ownerAddress, options) => {
            if (options.pageKey === 'page2') {
              return {
                ownedNfts: [{ id: 'nft3' }, { id: 'nft4' }],
                totalCount: 4,
                validAt: { blockNumber: 100 },
              };
            } else if (options.pageKey === 'page3') {
              return {
                ownedNfts: [],
                totalCount: 4,
                validAt: { blockNumber: 100 },
              };
            }
            return {
              ownedNfts: [{ id: 'nft1' }, { id: 'nft2' }],
              pageKey: 'page2',
              totalCount: 4,
              validAt: { blockNumber: 100 },
            };
          }),
        verifyNftOwnership: jest.fn(),
        getTransfersForContract: jest.fn(),
        getNftsForContractIterator: jest.fn(),
      },
      notify: {
        createWebhook: jest.fn(),
        deleteWebhook: jest.fn(),
        getAllWebhooks: jest.fn(),
      },
    })),
  };
});

describe('AlchemyWrapper', () => {
  let alchemyWrapper: AlchemyWrapper;

  beforeEach(() => {
    alchemyWrapper = new AlchemyWrapper();
  });
  describe('getNftsForOwner', () => {
    it('should retrieve all NFTs for owner across multiple pages', async () => {
      const options = {
        contractAddresses: ['contract1'],
      };
      const result = await alchemyWrapper.getNftsForOwner('owner1', options);
      expect(result.ownedNfts.length).toBe(4);
      expect(result.totalCount).toBe(4);
      expect(result.validAt.blockNumber).toBe(100);
    });

    it('should throw an error if no contract address is provided', async () => {
      const options = {};
      await expect(
        alchemyWrapper.getNftsForOwner('owner1', options)
      ).rejects.toThrow('At least one contract address must be provided.');
    });

    it('should retrieve NFTs for owner for a single page', async () => {
      const options = {
        contractAddresses: ['contract1'],
      };
      (alchemyWrapper as any).alchemy.nft.getNftsForOwner.mockResolvedValueOnce(
        {
          ownedNfts: [{ id: 'nft1' }],
          totalCount: 1,
          validAt: { blockNumber: 100 },
        }
      );

      const result = await alchemyWrapper.getNftsForOwner('owner1', options);
      expect(result.ownedNfts.length).toBe(1);
      expect(result.totalCount).toBe(1);
      expect(result.validAt.blockNumber).toBe(100);
    });

    it('should throw an error if getNftsForOwner reject', async () => {
      (alchemyWrapper as any).alchemy.nft.getNftsForOwner.mockRejectedValueOnce(
        new Error('Some API error')
      );

      const ownerAddress = 'mockAddress';
      const options = {
        contractAddresses: ['mockContractAddress'],
      };

      await expect(
        alchemyWrapper.getNftsForOwner(ownerAddress, options)
      ).rejects.toThrow('Some API error');
    });
  });
  describe('verifyNftOwnershipOnCollection', () => {
    // 1. Happy Path
    it('should successfully verify ownership of NFT for provided contract address', async () => {
      const mockOwner = 'ownerAddress123';
      const mockContractAddress = 'contract1';
      (
        alchemyWrapper as any
      ).alchemy.nft.verifyNftOwnership.mockResolvedValueOnce(true);
      const result = await alchemyWrapper.verifyNftOwnershipOnCollection(
        mockOwner,
        mockContractAddress
      );
      expect(result).toEqual(true);
    });
    // 2. Error Handling
    it('should throw an error if there is a problem verifying ownership', async () => {
      const mockOwner = 'ownerAddress123';
      const mockContractAddress = 'contract1';
      (
        alchemyWrapper as any
      ).alchemy.nft.verifyNftOwnership.mockRejectedValueOnce(
        new Error('Verification Error')
      );
      await expect(
        alchemyWrapper.verifyNftOwnershipOnCollection(
          mockOwner,
          mockContractAddress
        )
      ).rejects.toThrow('Verification Error');
    });
  });
  describe('verifyNftOwnershipOnCollections', () => {
    // 1. Happy Path
    it('should successfully verify ownership of NFTs for provided contract addresses', async () => {
      const mockOwner = 'ownerAddress123';
      const mockContractAddresses = ['contract1', 'contract2'];
      const mockResult = {
        contract1: true,
        contract2: false,
      };

      // Mock the internal call to the SDK or database
      (
        alchemyWrapper as any
      ).alchemy.nft.verifyNftOwnership.mockResolvedValueOnce(mockResult);

      const result = await alchemyWrapper.verifyNftOwnershipOnCollections(
        mockOwner,
        mockContractAddresses
      );
      expect(result).toEqual(mockResult);
    });

    // 2. Error Handling
    it('should throw an error if there is a problem verifying ownership', async () => {
      const mockOwner = 'ownerAddress123';
      const mockContractAddresses = ['contract1'];

      // Mock a rejection from the SDK or database call
      (
        alchemyWrapper as any
      ).alchemy.nft.verifyNftOwnership.mockRejectedValueOnce(
        new Error('Verification Error')
      );

      await expect(
        alchemyWrapper.verifyNftOwnershipOnCollections(
          mockOwner,
          mockContractAddresses
        )
      ).rejects.toThrow('Verification Error');
    });
  });

  describe('getTransfersForContract', () => {
    // 1. Retrieve All Transfers Across Multiple Pages
    it('should retrieve all transfers for a contract across multiple pages', async () => {
      const mockContractAddress = 'contractAddress123';
      const mockOptions = {
        fromBlock: '0x123',
        toBlock: '0x456',
      };
      const mockTransfersPage1 = [
        /*...first set of transfers...*/
      ];
      const mockTransfersPage2 = [
        /*...second set of transfers...*/
      ];

      // Simulate a paged response from the SDK
      (alchemyWrapper as any).alchemy.nft.getTransfersForContract
        .mockResolvedValueOnce({ nfts: mockTransfersPage1, pageKey: 'page2' })
        .mockResolvedValueOnce({ nfts: mockTransfersPage2 });

      const result = await alchemyWrapper.getTransfersForContract(
        mockContractAddress,
        mockOptions
      );
      expect(result).toEqual([...mockTransfersPage1, ...mockTransfersPage2]);
    });

    // 2. Single Page Retrieval
    it('should retrieve transfers for a contract for a single page', async () => {
      const mockContractAddress = 'contractAddress123';
      const mockOptions = {
        fromBlock: '0x123',
        toBlock: '0x456',
      };
      const mockTransfers = [
        /*...some transfers...*/
      ];

      // Mock the internal call to the SDK or database
      (
        alchemyWrapper as any
      ).alchemy.nft.getTransfersForContract.mockResolvedValueOnce({
        nfts: mockTransfers,
      });

      const result = await alchemyWrapper.getTransfersForContract(
        mockContractAddress,
        mockOptions
      );
      expect(result).toEqual(mockTransfers);
    });

    // 3. Error Handling
    it('should throw an error if there is a problem retrieving transfers', async () => {
      const mockContractAddress = 'contractAddress123';
      const mockOptions = {
        fromBlock: '0x123',
        toBlock: '0x456',
      };

      // Mock a rejection from the SDK or database call
      (
        alchemyWrapper as any
      ).alchemy.nft.getTransfersForContract.mockRejectedValueOnce(
        new Error('Retrieval Error')
      );

      await expect(
        alchemyWrapper.getTransfersForContract(mockContractAddress, mockOptions)
      ).rejects.toThrow('Retrieval Error');
    });
  });
  describe('fetchAllNftsWithMetadata', () => {
    // 1. Iterable Works
    it('should retrieve all NFTs with metadata iteratively', async () => {
      const mockNfts = ['dummy'];

      // Mock the internal iterable function
      const mockIterable = {
        [Symbol.asyncIterator]: async function* () {
          yield* mockNfts;
        },
      };
      (
        alchemyWrapper as any
      ).alchemy.nft.getNftsForContractIterator.mockReturnValueOnce(
        mockIterable
      );

      const result = await alchemyWrapper.fetchAllNftsWithMetadata(
        'contractAddress123'
      );

      expect(result).toEqual(mockNfts);
    });

    // 2. Error Handling
    it('should throw an error if there is a problem retrieving NFTs with metadata', async () => {
      // Mock a rejection from the internal iterable function
      const mockErrorIterable = {
        // eslint-disable-next-line require-yield
        [Symbol.asyncIterator]: async function* () {
          throw new Error('Retrieval Error');
        },
      };
      (
        alchemyWrapper as any
      ).alchemy.nft.getNftsForContractIterator.mockReturnValueOnce(
        mockErrorIterable
      );

      await expect(
        alchemyWrapper.fetchAllNftsWithMetadata('contractAddress123')
      ).rejects.toThrow('Retrieval Error');
    });
  });

  describe('fetchAllNftsWithoutMetadata', () => {
    // 1. Iterable Works
    it('should retrieve all NFTs without metadata iteratively', async () => {
      const mockNfts = ['dummy2'];

      // Mock the internal iterable function
      const mockIterable = {
        [Symbol.asyncIterator]: async function* () {
          yield* mockNfts;
        },
      };
      (
        alchemyWrapper as any
      ).alchemy.nft.getNftsForContractIterator.mockReturnValueOnce(
        mockIterable
      );

      const result = await alchemyWrapper.fetchAllNftsWithoutMetadata(
        'contractAddress123'
      );
      expect(result).toEqual(mockNfts);
    });

    // 2. Error Handling
    it('should throw an error if there is a problem retrieving NFTs without metadata', async () => {
      // Mock a rejection from the internal iterable function
      const mockErrorIterable = {
        // eslint-disable-next-line require-yield
        [Symbol.asyncIterator]: async function* () {
          throw new Error('Retrieval Error');
        },
      };
      (
        alchemyWrapper as any
      ).alchemy.nft.getNftsForContractIterator.mockReturnValueOnce(
        mockErrorIterable
      );

      await expect(
        alchemyWrapper.fetchAllNftsWithoutMetadata('contractAddress123')
      ).rejects.toThrow('Retrieval Error');
    });
  });
  describe('createNftActivityWebhook', () => {
    it('should call the SDK method with correct arguments and return the result', async () => {
      const mockWebhookUrl = 'http://example.com/webhook';
      const mockFilters = [
        {
          contractAddress: '0x123',
        },
      ];
      const mockResponse = {
        type: WebhookType.NFT_ACTIVITY,
      };

      (
        alchemyWrapper as any
      ).alchemy.notify.createWebhook.mockResolvedValueOnce(mockResponse);

      const result = await alchemyWrapper.createNftActivityWebhook(
        mockWebhookUrl,
        mockFilters
      );

      expect(
        (alchemyWrapper as any).alchemy.notify.createWebhook
      ).toHaveBeenCalledWith(mockWebhookUrl, WebhookType.NFT_ACTIVITY, {
        network: alchemyWrapper.network,
        filters: mockFilters,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if SDK method fails', async () => {
      const mockWebhookUrl = 'http://example.com/webhook';
      const mockFilters = [
        {
          contractAddress: '0x123',
        },
      ];

      (
        alchemyWrapper as any
      ).alchemy.notify.createWebhook.mockRejectedValueOnce(
        new Error('Creation Error')
      );

      await expect(
        alchemyWrapper.createNftActivityWebhook(mockWebhookUrl, mockFilters)
      ).rejects.toThrow('Creation Error');
    });
  });

  describe('deleteNftActivityWebhook', () => {
    it('should call the SDK method with correct argument', async () => {
      const mockWebhookId = 'webhook123';

      await alchemyWrapper.deleteNftActivityWebhook(mockWebhookId);

      expect(
        (alchemyWrapper as any).alchemy.notify.deleteWebhook
      ).toHaveBeenCalledWith(mockWebhookId);
    });

    it('should throw an error if SDK method fails', async () => {
      const mockWebhookId = 'webhook123';

      (
        alchemyWrapper as any
      ).alchemy.notify.deleteWebhook.mockRejectedValueOnce(
        new Error('Deletion Error')
      );

      await expect(
        alchemyWrapper.deleteNftActivityWebhook(mockWebhookId)
      ).rejects.toThrow('Deletion Error');
    });
  });

  describe('getAllWebhooks', () => {
    it('should call the SDK method and return the result', async () => {
      const mockResponse = {
        webhooks: [],
        totalCount: 1,
      };

      (
        alchemyWrapper as any
      ).alchemy.notify.getAllWebhooks.mockResolvedValueOnce(mockResponse);

      const result = await alchemyWrapper.getAllWebhooks();

      expect(
        (alchemyWrapper as any).alchemy.notify.getAllWebhooks
      ).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if SDK method fails', async () => {
      (
        alchemyWrapper as any
      ).alchemy.notify.getAllWebhooks.mockRejectedValueOnce(
        new Error('Fetch Error')
      );

      await expect(alchemyWrapper.getAllWebhooks()).rejects.toThrow(
        'Fetch Error'
      );
    });
  });
});
