import { adminSdk } from '@gql/admin/api';
import { NftStatus_Enum } from '@gql/shared/types';
import { MintPasswordNftWrapper } from '@nft/mint-password';
import { LoyaltyCardNftWrapper } from './index';

jest.mock('@gql/admin/api');
jest.mock('@nft/mint-password');

describe('LoyaltyCardNftWrapper', () => {
  let loyaltyCardNftWrapper: LoyaltyCardNftWrapper;

  const mockInputData = {
    contractAddress: '0x123',
    chainId: '1',
    ownerAddress: '0x456',
    organizerId: '1',
    tokenId: '1',
  };

  beforeEach(() => {
    loyaltyCardNftWrapper = new LoyaltyCardNftWrapper();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getLoyaltyCardOwnedByAddress', () => {
    it('should return the loyalty card owned by the address', async () => {
      const mockLoyaltyCard = { id: '1', status: NftStatus_Enum.Confirmed };
      (adminSdk.GetLoyaltyCardOwnedByAddress as jest.Mock).mockResolvedValue({
        loyaltyCardNft: [mockLoyaltyCard],
      });

      const result =
        await loyaltyCardNftWrapper.getLoyaltyCardOwnedByAddress(mockInputData);

      expect(result).toEqual(mockLoyaltyCard);
    });
  });

  describe('GetLoyaltyCardNftContractByContractAddress', () => {
    it('should return the loyalty card ID by contract address', async () => {
      const mockLoyaltyCardNftContract = {
        loyaltyCardId: '1',
        organizerId: '1',
      };
      (
        adminSdk.GetLoyaltyCardNftContractByContractAddress as jest.Mock
      ).mockResolvedValue({
        loyaltyCardNftContract: [mockLoyaltyCardNftContract],
      });

      const result =
        await loyaltyCardNftWrapper.getLoyaltyCardNftContractByContractAddress(
          mockInputData,
        );

      expect(result).toEqual(mockLoyaltyCardNftContract);
    });
  });

  describe('mintWithPassword', () => {
    it('should mint a loyalty card with password', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Burned,
        organizerId: '1',
      };
      const mockNftMintPassword = { id: '1' };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);
      jest
        .spyOn(
          loyaltyCardNftWrapper,
          'getLoyaltyCardNftContractByContractAddress',
        )
        .mockResolvedValue({
          loyaltyCardId: '1',
          organizerId: '1',
        });
      (
        MintPasswordNftWrapper.prototype.evaluateNftMintPassword as jest.Mock
      ).mockResolvedValue(mockNftMintPassword);

      await loyaltyCardNftWrapper.mintWithPassword({
        ...mockInputData,
        password: 'password',
      });

      expect(adminSdk.InsertLoyaltyCardNft).toHaveBeenCalledWith({
        object: {
          loyaltyCardId: '1',
          status: NftStatus_Enum.Confirmed,
          ...mockInputData,
        },
      });
      expect(
        MintPasswordNftWrapper.prototype.assignNftMintPasswordToMinter,
      ).toHaveBeenCalledWith({
        id: '1',
        minterAddress: mockInputData.ownerAddress,
      });
    });
    it('should throw an error if the loyalty card is already minted', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Confirmed,
        organizerId: '1',
      };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);

      await expect(
        loyaltyCardNftWrapper.mintWithPassword({
          ...mockInputData,
          password: 'password',
        }),
      ).rejects.toThrow('Loyalty card already minted');
    });

    it('should throw an error if the password is invalid', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Burned,
        organizerId: '1',
      };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);
      (
        MintPasswordNftWrapper.prototype.evaluateNftMintPassword as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        loyaltyCardNftWrapper.mintWithPassword({
          ...mockInputData,
          password: 'invalidPassword',
        }),
      ).rejects.toThrow('Invalid password');
    });
    it('should throw an error if no loyalty card is found for the contract address', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Burned,
        organizerId: '1',
      };
      const mockNftMintPassword = { id: '1' };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);
      jest
        .spyOn(
          loyaltyCardNftWrapper,
          'getLoyaltyCardNftContractByContractAddress',
        )
        .mockResolvedValue(null);
      (
        MintPasswordNftWrapper.prototype.evaluateNftMintPassword as jest.Mock
      ).mockResolvedValue(mockNftMintPassword);

      await expect(
        loyaltyCardNftWrapper.mintWithPassword({
          ...mockInputData,
          password: 'password',
        }),
      ).rejects.toThrow('No loyalty card found for this contract address');
    });
  });

  describe('setAsMinted', () => {
    it('should update the NFT mint password token ID and set the loyalty card as completed', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Burned,
        organizerId: '1',
      };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);

      await loyaltyCardNftWrapper.setAsMinted(mockInputData);

      expect(adminSdk.UpdateNftMintPasswordTokenId).toHaveBeenCalledWith({
        ...mockInputData,
        minterAddress: mockInputData.ownerAddress,
        tokenId: mockInputData.tokenId,
      });
      expect(adminSdk.UpdateLoyaltyCardNft).toHaveBeenCalledWith({
        id: '1',
        object: {
          status: NftStatus_Enum.Completed,
          tokenId: mockInputData.tokenId,
        },
      });
    });

    it('should throw an error if the loyalty card is already burned', async () => {
      const mockLoyaltyCard = {
        id: '1',
        status: NftStatus_Enum.Completed,
        organizerId: '1',
      };
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(mockLoyaltyCard);

      await expect(
        loyaltyCardNftWrapper.setAsMinted(mockInputData),
      ).rejects.toThrow('Loyalty card already burned');
    });

    it('should throw an error if the loyalty card is not found', async () => {
      jest
        .spyOn(loyaltyCardNftWrapper, 'getLoyaltyCardOwnedByAddress')
        .mockResolvedValue(null);

      await expect(
        loyaltyCardNftWrapper.setAsMinted(mockInputData),
      ).rejects.toThrow('No loyalty card found');
    });
  });
});
