import { adminSdk } from '@gql/admin/api';
import { OrderStatus_Enum } from '@gql/shared/types';
import { describe } from 'node:test';
import { NftClaimable } from './nft-thirdweb-api';

describe('NftClaimable exists', () => {
  it('should work', () => {
    expect(new NftClaimable()).toBeDefined();
  });
});

describe('NftClaimable good arguments', () => {
  let nftClaimable: NftClaimable;

  beforeEach(() => {
    nftClaimable = new NftClaimable();
    nftClaimable.sdk.getContract = jest.fn().mockReturnValue({
      erc721: {
        totalUnclaimedSupply: jest.fn().mockResolvedValue(1),
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
    });
    nftClaimable.registerOwnership = jest.fn().mockResolvedValue({});
  });

  it('should succeed if ClaimAllMetadatas receive a valid order', async () => {
    const nfts = await nftClaimable.claimAllMetadatas([
      {
        id: '93098f3a-c4e8-4b0a-91a9-7b951ab9ed0d',
        quantity: 1,
        eventPassId: 'dummy',
        status: OrderStatus_Enum.Confirmed,
        account: {
          address: '0xYourAccountAddress',
        },
        eventPassNftContract: {
          contractAddress: '0xYourContractAddress',
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
        totalUnclaimedSupply: jest.fn().mockResolvedValue(1),
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
    });
    nftClaimable.registerOwnership = jest
      .fn()
      .mockImplementation((args) => Promise.resolve(args));
    adminSdk.UpdateEventPassOrdersStatus = jest.fn().mockReturnValue({});
  });

  it('should throw if checkOrder throws an error', async () => {
    const order = {
      id: '93098f3a-c4e8-4b0a-91a9-7b951ab9ed0d',
      quantity: 3,
      eventPassId: 'dummy',
      status: OrderStatus_Enum.Confirmed,
      account: {
        address: '0xYourAccountAddress',
      },
      eventPassNftContract: {
        contractAddress: '0xYourContractAddress',
      },
    };

    await expect(nftClaimable.claimAllMetadatas([order])).rejects.toThrow(
      `Error during check of the unclaim supply: Not enough supply for order ${order.id} : 1 remaining`,
    );
  });

  it('should call console.error with "Fake error" if claimTo throw', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const nfts = await nftClaimable.claimAllMetadatas([
      {
        id: '479be2e4-103b-4345-9685-28c16ef3bd71',
        quantity: 1,
        eventPassId: 'dummy',
        status: OrderStatus_Enum.Confirmed,
        account: {
          address: '0xYourAccountAddress',
        },
        eventPassNftContract: {
          contractAddress: '0x1',
        },
      },
      {
        id: 'f5364b4d-b70e-4fa4-8539-d0198fd36270',
        quantity: 1,
        eventPassId: 'dummy',
        status: OrderStatus_Enum.Confirmed,
        account: {
          address: 'BadAccountAddress',
        },
        eventPassNftContract: {
          contractAddress: '0x2',
        },
      },
    ]);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error: Error during claiming operation: Fake error',
    );
    expect(nftClaimable.registerOwnership).toHaveBeenCalled();
    expect(nfts.updates[0]._set.currentOwnerAddress).toEqual(
      '0xYourAccountAddress',
    );

    consoleSpy.mockRestore();
  });
});
