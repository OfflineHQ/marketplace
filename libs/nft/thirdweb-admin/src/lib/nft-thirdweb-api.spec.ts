import NftClaimable from './nft-thirdweb-api';
import { adminSdk } from '@gql/admin/api';

describe('NftClaimable exists', () => {
  it('should work', () => {
    expect(new NftClaimable()).toBeDefined();
  });
});

const contractAddressAdmin = '0x3E45A57ff6bf3bF55F167FCe657001F8ddE3fbC5'; // Contract address where the Master Private Key is an admin
const contractAddressNotAdmin = '0xBcC862c75A1fC85D89bAaa5D47E1F672c1Dc9154'; // Contract address where it is not

describe('NftClaimable bad arguments', () => {
  let nftClaimable: NftClaimable;

  beforeEach(() => {
    nftClaimable = new NftClaimable();
  });

  it('should throw if maxAmount is 0', async () => {
    await expect(
      nftClaimable.startClaimPhase(contractAddressAdmin, 'Phase de claim', 0)
    ).rejects.toThrow();
  });

  it('should throw if master wallet not admin', async () => {
    await expect(
      nftClaimable.startClaimPhase(
        contractAddressNotAdmin,
        'Phase de claim',
        20
      )
    ).rejects.toThrow();
  }, 20000);
});

describe('NftClaimable good arguments', () => {
  let nftClaimable: NftClaimable;

  beforeEach(() => {
    nftClaimable = new NftClaimable();
    nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
      erc721: {
        claimConditions: {
          set: jest.fn().mockResolvedValue({
            receipt: {
              transactionHash:
                '0xc7a649c65b62b54e93bbd350bc9b60141a082e7e72b89adb59afcff4659028c4',
            },
          }),
        },
        claimTo: jest
          .fn()
          .mockResolvedValue([
            { id: { toNumber: jest.fn().mockReturnValue(1) } },
          ]),
      },
      totalUnclaimedSupply: jest.fn().mockResolvedValue(1),
    });
    nftClaimable.registerOwnership = jest.fn().mockResolvedValue({});
  });

  it('should succeed if startClaimPhase receives a valid contractAddress', async () => {
    const result = await nftClaimable.startClaimPhase(
      '0x2e41588A1c8455dbD63B07E9401422B7F5559859',
      'Phase de claim',
      100
    );
    expect(result).toBe(
      '0xc7a649c65b62b54e93bbd350bc9b60141a082e7e72b89adb59afcff4659028c4'
    );
  });

  it('should succeed if ClaimAllMetadatas receive a valid order', async () => {
    const nfts = await nftClaimable.claimAllMetadatas([
      {
        id: '93098f3a-c4e8-4b0a-91a9-7b951ab9ed0d',
        quantity: 1,
        account: {
          address: '0xYourAccountAddress',
        },
        eventPass: {
          eventPassNftContract: {
            contractAddress: '0xYourContractAddress',
          },
        },
      },
    ]);
    expect(nfts).toBeDefined();
  });
});

describe('NftClaimable order fail', () => {
  let nftClaimable: NftClaimable;

  beforeEach(() => {
    nftClaimable = new NftClaimable();
    nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
      erc721: {
        claimTo: jest.fn((toAddress) => {
          if (toAddress === '0xYourAccountAddress') {
            return Promise.resolve([
              {
                id: {
                  toNumber() {
                    return 1;
                  },
                },
              },
            ]);
          } else {
            return Promise.reject(new Error('Fake error'));
          }
        }),
      },
      totalUnclaimedSupply: jest.fn().mockResolvedValue(1),
    });
    nftClaimable.registerOwnership = jest
      .fn()
      .mockImplementation((args) => Promise.resolve(args));
    adminSdk.UpsertEventPassOrders = jest.fn().mockReturnValue({});
  });

  it('should call console.error with "Fake error" if claimTo throw', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const nfts = await nftClaimable.claimAllMetadatas([
      {
        id: '479be2e4-103b-4345-9685-28c16ef3bd71',
        quantity: 1,
        account: {
          address: '0xYourAccountAddress',
        },
        eventPass: {
          eventPassNftContract: {
            contractAddress: '0x1',
          },
        },
      },
      {
        id: 'f5364b4d-b70e-4fa4-8539-d0198fd36270',
        quantity: 1,
        account: {
          address: 'BadAccountAddress',
        },
        eventPass: {
          eventPassNftContract: {
            contractAddress: '0x2',
          },
        },
      },
    ]);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error: Error during claiming operation: Fake error'
    );
    expect(nftClaimable.registerOwnership).toHaveBeenCalled();
    expect(nfts.updates[0]._set.currentOwnerAddress).toEqual(
      '0xYourAccountAddress'
    );

    consoleSpy.mockRestore();
  });
});
