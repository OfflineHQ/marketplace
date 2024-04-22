import { adminSdk } from '@gql/admin/api';
import { SmartContract, ThirdwebSDK } from '@thirdweb-dev/sdk';
import { BaseContract, ethers } from 'ethers';
import {
  createStampNftContract,
  createStampNfts,
  insertMinterTemporaryWallet,
} from './action.js';
import { StampsCollection } from './index';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetShopifyCustomers: jest.fn(),
  },
}));

jest.mock('@thirdweb-dev/sdk', () => ({
  ThirdwebSDK: jest.fn().mockImplementation(() => ({
    deployer: {
      deployEditionDrop: jest.fn().mockResolvedValue('0xContractAddress'),
    },
    getContract: jest.fn(() => ({
      erc1155: {
        mint: jest.fn().mockResolvedValue({ id: '1' }),
        airdrop: jest.fn().mockResolvedValue(undefined),
      },
    })),
  })),
}));

jest.mock('./action', () => ({
  createStampNftContract: jest.fn(),
  createStampNfts: jest.fn(),
  insertMinterTemporaryWallet: jest.fn(),
}));

describe('StampsCollection happy path', () => {
  let stampsCollection: StampsCollection;
  const organizerId = 'org1';
  const mockSdk = new ThirdwebSDK('mock-network');
  const mockWallet = {
    address: '0x123',
    privateKey: 'mockPrivateKey',
  } as ethers.Wallet;
  const mockCampaignBody = {
    campaignId: 'campaign1',
    pairings: [
      {
        productId: 'product1',
        customersIds: ['customer1', 'customer2'],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    stampsCollection = new StampsCollection(mockSdk);
    jest
      .spyOn(mockSdk.deployer, 'deployEditionDrop')
      .mockResolvedValue('0xContractAddress');
    jest.spyOn(mockSdk, 'getContract').mockResolvedValue({
      erc1155: {
        mint: jest.fn().mockResolvedValue({ id: '1' }),
        airdrop: jest.fn().mockResolvedValue(undefined),
      },
    } as unknown as SmartContract<BaseContract>);
    jest.spyOn(adminSdk, 'GetShopifyCustomers').mockResolvedValue({
      shopifyCustomer: [{ address: '0xAddress1' }, { address: '0xAddress2' }],
    });
  });

  it('should deploy a contract, register it, handle pairings, and finalize the campaign', async () => {
    const result = await stampsCollection.processCampaign(
      'org1',
      mockWallet,
      mockCampaignBody,
    );

    expect(result).toEqual('0xcontractaddress');
    expect(mockSdk.deployer.deployEditionDrop).toHaveBeenCalledWith({
      name: 'campaign1',
      primary_sale_recipient: mockWallet.address,
    });
    expect(createStampNftContract).toHaveBeenCalled();
    expect(createStampNfts).toHaveBeenCalled();
    expect(insertMinterTemporaryWallet).toHaveBeenCalledWith(
      mockWallet,
      'campaign1',
    );
  });

  it('should successfully process a campaign', async () => {
    const contractAddress = await stampsCollection.processCampaign(
      organizerId,
      mockWallet,
      mockCampaignBody,
    );

    expect(contractAddress).toEqual('0xcontractaddress');
    expect(mockSdk.deployer.deployEditionDrop).toHaveBeenCalled();
    expect(createStampNftContract).toHaveBeenCalled();
    expect(createStampNfts).toHaveBeenCalled();
    expect(insertMinterTemporaryWallet).toHaveBeenCalledWith(
      mockWallet,
      mockCampaignBody.campaignId,
    );
  });

  it('should handle empty pairings', async () => {
    const emptyPairingsBody = {
      ...mockCampaignBody,
      pairings: [],
    };

    await expect(
      stampsCollection.processCampaign(
        organizerId,
        mockWallet,
        emptyPairingsBody,
      ),
    ).rejects.toThrow('No pairings provided');
  });

  it('should throw an error if deployment fails', async () => {
    jest
      .spyOn(mockSdk.deployer, 'deployEditionDrop')
      .mockRejectedValue(new Error('Deployment failed'));

    await expect(
      stampsCollection.processCampaign(
        organizerId,
        mockWallet,
        mockCampaignBody,
      ),
    ).rejects.toThrow('Deployment failed');

    expect(createStampNftContract).not.toHaveBeenCalled();
    expect(createStampNfts).not.toHaveBeenCalled();
    expect(insertMinterTemporaryWallet).not.toHaveBeenCalled();
  });

  it('should handle errors during NFT minting', async () => {
    jest.spyOn(mockSdk, 'getContract').mockResolvedValueOnce({
      erc1155: {
        mint: jest.fn().mockRejectedValue(new Error('Minting failed')),
        airdrop: jest.fn(),
      },
    } as unknown as SmartContract<BaseContract>);

    await expect(
      stampsCollection.processCampaign(
        organizerId,
        mockWallet,
        mockCampaignBody,
      ),
    ).rejects.toThrow('Minting failed');

    expect(createStampNfts).not.toHaveBeenCalled();
  });

  it('should verify arguments passed to airdropNFT', async () => {
    const testCampaignBody = {
      campaignId: 'campaign1',
      pairings: [
        {
          productId: 'product1',
          customersIds: ['customer1', 'customer2'],
        },
      ],
    };

    jest
      .spyOn(stampsCollection, 'getRecipientAddresses')
      .mockResolvedValue(['0xAddress1', '0xAddress2']);

    const airdropSpy = jest.spyOn(stampsCollection, 'airdropNFT');

    await stampsCollection.processCampaign(
      organizerId,
      mockWallet,
      testCampaignBody,
    );

    expect(airdropSpy).toHaveBeenCalledWith('0xcontractaddress', '1', [
      '0xAddress1',
      '0xAddress2',
    ]);
  });

  it('should handle multiple products with different customers and unique token IDs', async () => {
    const multiProductCampaignBody = {
      campaignId: 'multiProductCampaign',
      pairings: [
        {
          productId: 'product1',
          customersIds: ['customer1', 'customer2'],
        },
        {
          productId: 'product2',
          customersIds: ['customer3'],
        },
      ],
    };

    jest
      .spyOn(stampsCollection, 'getRecipientAddresses')
      .mockImplementation((organizerId: string, customerIds: string[]) => {
        if (
          customerIds.includes('customer1') ||
          customerIds.includes('customer2')
        ) {
          return Promise.resolve(['0xAddress1', '0xAddress2']);
        } else {
          return Promise.resolve(['0xAddress3']);
        }
      });

    jest
      .spyOn(stampsCollection, 'mintNFT')
      .mockImplementation(
        (contractAddress: string, productId: string, supplyAmount: number) => {
          return Promise.resolve(
            productId === 'product1' ? 'token1' : 'token2',
          );
        },
      );

    const airdropSpy = jest.spyOn(stampsCollection, 'airdropNFT');

    await stampsCollection.processCampaign(
      organizerId,
      mockWallet,
      multiProductCampaignBody,
    );

    expect(airdropSpy).toHaveBeenCalledWith('0xcontractaddress', 'token1', [
      '0xAddress1',
      '0xAddress2',
    ]);
    expect(airdropSpy).toHaveBeenCalledWith('0xcontractaddress', 'token2', [
      '0xAddress3',
    ]);
  });

  it('should handle a large number of products and customers, including edge cases', async () => {
    const manyCustomers = Array.from(
      { length: 20 },
      (_, i) => `customer${i + 1}`,
    );

    const highVolumeCampaignBody = {
      campaignId: 'highVolumeCampaign',
      pairings: [
        {
          productId: 'product1',
          customersIds: ['singleCustomer'],
        },
        {
          productId: 'product2',
          customersIds: manyCustomers,
        },
        ...Array.from({ length: 3 }, (_, i) => ({
          productId: `product${i + 3}`,
          customersIds: Array.from(
            { length: Math.floor(Math.random() * 11) + 5 },
            (_, j) => `customer${i * 15 + j + 21}`,
          ),
        })),
      ],
    };

    jest
      .spyOn(stampsCollection, 'getRecipientAddresses')
      .mockImplementation((organizerId: string, customerIds: string[]) => {
        return Promise.resolve(
          customerIds.map((id) => `0xAddress${id.replace('customer', '')}`),
        );
      });

    jest
      .spyOn(stampsCollection, 'mintNFT')
      .mockImplementation(
        (contractAddress: string, productId: string, supplyAmount: number) => {
          return Promise.resolve(`token${productId.replace('product', '')}`);
        },
      );

    const airdropSpy = jest.spyOn(stampsCollection, 'airdropNFT');

    await stampsCollection.processCampaign(
      organizerId,
      mockWallet,
      highVolumeCampaignBody,
    );

    highVolumeCampaignBody.pairings.forEach((pairing) => {
      expect(airdropSpy).toHaveBeenCalledWith(
        '0xcontractaddress',
        `token${pairing.productId.replace('product', '')}`,
        pairing.customersIds.map(
          (id) => `0xAddress${id.replace('customer', '')}`,
        ),
      );
    });
  });
});
