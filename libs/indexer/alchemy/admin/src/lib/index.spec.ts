import { AlchemyWrapper, fetchAllPages } from './index';

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
      },
    })),
  };
});

describe('AlchemyWrapper', () => {
  let alchemyWrapper: AlchemyWrapper;

  beforeEach(() => {
    alchemyWrapper = new AlchemyWrapper();
  });

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
    (alchemyWrapper as any).alchemy.nft.getNftsForOwner.mockResolvedValueOnce({
      ownedNfts: [{ id: 'nft1' }],
      totalCount: 1,
      validAt: { blockNumber: 100 },
    });

    const result = await alchemyWrapper.getNftsForOwner('owner1', options);
    expect(result.ownedNfts.length).toBe(1);
    expect(result.totalCount).toBe(1);
    expect(result.validAt.blockNumber).toBe(100);
  });
});
