import { adminSdk } from '@gql/admin/api';
import { GetLoyaltyCardByContractAddressForProcessQuery } from '@gql/admin/types';
import { NftStatus_Enum } from '@gql/shared/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { LoyaltyCardNft } from './loyaltyCardNft';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    UpdateLoyaltyCardNfts: jest.fn(),
  },
}));

// Mock the ThirdwebSDK to simulate contract interactions
jest.mock('@thirdweb-dev/sdk', () => ({
  ThirdwebSDK: {
    fromPrivateKey: jest.fn(),
  },
}));

describe('LoyaltyCardNft', () => {
  let loyaltyCardNft: LoyaltyCardNft;

  beforeEach(() => {
    loyaltyCardNft = new LoyaltyCardNft();
  });

  describe('multicallClaim', () => {
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

      await loyaltyCardNft.multicallClaim(
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
        loyaltyCardNft.multicallClaim(minterTemporaryWallet, loyaltyCards),
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
        loyaltyCardNft.multicallClaim(
          minterTemporaryWallet,
          loyaltyCards as GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
        ),
      ).rejects.toThrow(
        'ContractAddress is undefined for loyaltyCardId mockLoyaltyCardId and temporary wallet address mockWalletAddres',
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

      await loyaltyCardNft.multicallClaim(
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
});
