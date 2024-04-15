import { adminSdk } from '@gql/admin/api';
import { GetLoyaltyCardByContractAddressForProcessQuery } from '@gql/admin/types';
import { NftStatus_Enum } from '@gql/shared/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { CollectionDeploymentError, LoyaltyCardCollection } from './index';

jest.mock('@next/next-auth/user', () => {
  return {
    getCurrentUser: jest.fn().mockResolvedValue({
      role: {
        organizerId: 'test-organizer-id',
      },
    }),
  };
});

jest.mock('@nft/thirdweb-organizer-common', () => ({
  ThirdwebOrganizerCommon: jest.fn().mockImplementation(() => ({
    setErc721ContractWithClaimConditions: jest
      .fn()
      .mockResolvedValue({ wallet: 'mockWallet' }),
    getAddressAndChainId: jest.fn().mockResolvedValue(['mockAddress', 123]),
    createNftMintPasswords: jest.fn().mockResolvedValue('mockMintPasswords'),
  })),
  insertMinterTemporaryWallet: jest.fn(),
}));

jest.mock('./action', () => ({
  ...jest.requireActual('./action'),
  createLoyaltyCardContract: jest.fn(),
  createLoyaltyCardParametersAndWebhook: jest.fn(),
}));

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    UpdateLoyaltyCardNfts: jest.fn(),
    InsertLoyaltyCardNftContract: jest.fn(),
  },
}));

// Mock the ThirdwebSDK to simulate contract interactions
jest.mock('@thirdweb-dev/sdk', () => ({
  ThirdwebSDK: {
    fromPrivateKey: jest.fn(),
  },
}));

describe('LoyaltyCardCollection', () => {
  let loyaltyCardCollection: LoyaltyCardCollection;
  let mockSdk: ThirdwebSDK;

  beforeEach(() => {
    mockSdk = {
      deployer: {
        deployLoyaltyCard: jest.fn().mockResolvedValue('mockContractAddress'),
      },
    } as unknown as ThirdwebSDK;
    loyaltyCardCollection = new LoyaltyCardCollection(mockSdk);
  });

  describe('multicallMint', () => {
    it('updates loyalty cards to error status if minting fails', async () => {
      const minterTemporaryWallet = {
        address: 'mockWalletAddress',
        privateKey: 'mockPrivateKey',
      };
      const loyaltyCards = [
        {
          id: '1',
          contractAddress: 'mockContractAddress',
          loyaltyCardId: 'mockLoyaltyCardId',
          ownerAddress: 'mockOwnerAddress',
          metadata: 'mockMetadata',
        },
      ];

      // Mock the SDK to throw an error during the contract call
      (ThirdwebSDK.fromPrivateKey as jest.Mock).mockImplementation(() => ({
        getContract: jest.fn().mockResolvedValue({
          prepare: jest.fn().mockImplementation(() => ({
            encode: jest.fn().mockResolvedValue('encodedTransaction'),
          })),
          call: jest.fn().mockRejectedValue(new Error('Mock minting error')),
        }),
      }));

      await loyaltyCardCollection.multicallMint(
        minterTemporaryWallet,
        loyaltyCards as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
      );

      expect(adminSdk.UpdateLoyaltyCardNfts).toHaveBeenCalledWith({
        updates: loyaltyCards.map((loyaltyCard) => ({
          _set: {
            status: NftStatus_Enum.Error,
          },
          where: {
            id: {
              _eq: loyaltyCard.id,
            },
          },
        })),
      });
    });

    it('throws an error if loyaltyCards array is empty', async () => {
      const minterTemporaryWallet = {
        address: 'mockWalletAddress',
        privateKey: 'mockPrivateKey',
      };
      const loyaltyCards = [];

      await expect(
        loyaltyCardCollection.multicallMint(
          minterTemporaryWallet,
          loyaltyCards,
        ),
      ).rejects.toThrow('No loyaltyCards found or loyaltyCardId is undefined');
    });

    it('throws an error if contractAddress is undefined', async () => {
      const minterTemporaryWallet = {
        address: 'mockWalletAddress',
        privateKey: 'mockPrivateKey',
      };
      const loyaltyCards = [
        {
          id: '1',
          contractAddress: undefined,
          loyaltyCardId: 'mockLoyaltyCardId',
          ownerAddress: 'mockOwnerAddress',
          metadata: 'mockMetadata',
        },
      ];

      await expect(
        loyaltyCardCollection.multicallMint(
          minterTemporaryWallet,
          loyaltyCards as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
        ),
      ).rejects.toThrow(
        'ContractAddress is undefined for eventPassId mockLoyaltyCardId and temporary wallet address mockWalletAddress',
      );
    });
    it('updates loyalty cards to completed status if minting succeeds', async () => {
      const loyaltyCards = [
        {
          id: '1',
          contractAddress: 'mockContractAddress',
          loyaltyCardId: 'mockLoyaltyCardId',
          ownerAddress: 'mockOwnerAddress',
          metadata: 'mockMetadata',
        },
      ];

      const minterTemporaryWallet = {
        address: 'mockWalletAddress',
        privateKey: 'mockPrivateKey',
      };

      (ThirdwebSDK.fromPrivateKey as jest.Mock).mockImplementation(() => ({
        getContract: jest.fn().mockResolvedValue({
          prepare: jest.fn().mockImplementation(() => ({
            encode: jest.fn().mockResolvedValue('encodedTransaction'),
          })),
          call: jest.fn().mockResolvedValue(undefined), // Simulate successful call
        }),
      }));

      await loyaltyCardCollection.multicallMint(
        minterTemporaryWallet,
        loyaltyCards as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
      );

      expect(adminSdk.UpdateLoyaltyCardNfts).toHaveBeenCalledWith({
        updates: loyaltyCards.map((loyaltyCard) => ({
          _set: {
            status: NftStatus_Enum.Completed,
          },
          where: {
            id: {
              _eq: loyaltyCard.id,
            },
          },
        })),
      });
    });
  });

  describe('deployLoyaltyCardCollection', () => {
    it('should deploy a loyalty card collection successfully', async () => {
      const props = {
        id: 'mockId',
        nftImage: { url: 'mockImageUrl' },
        nftName: 'mockNftName',
        amount: 100,
      };

      const result =
        await loyaltyCardCollection.deployLoyaltyCardCollection(props);

      expect(mockSdk.deployer.deployLoyaltyCard).toHaveBeenCalledWith({
        name: 'mockNftName',
        primary_sale_recipient: 'mockAddress',
      });
      expect(
        loyaltyCardCollection.thirdwebOrganizerCommon
          .setErc721ContractWithClaimConditions,
      ).toHaveBeenCalledWith('mockContractAddress', 50000);
      expect(
        loyaltyCardCollection.thirdwebOrganizerCommon.createNftMintPasswords,
      ).toHaveBeenCalledWith({
        contractAddress: 'mockcontractaddress',
        chainId: '123',
        amount: 100,
      });
      expect(result).toBe('mockMintPasswords');
    });

    it('should throw CollectionDeploymentError if an error occurs', async () => {
      const props = {
        id: 'mockId',
        nftImage: { url: 'mockImageUrl' },
        nftName: 'mockNftName',
        amount: 100,
      };
      const errorMessage = 'Deployment error';
      (
        mockSdk.deployer.deployLoyaltyCard as jest.MockedFunction<
          typeof mockSdk.deployer.deployLoyaltyCard
        >
      ).mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        loyaltyCardCollection.deployLoyaltyCardCollection(props),
      ).rejects.toThrow(new CollectionDeploymentError(new Error(errorMessage)));
    });
  });
});
