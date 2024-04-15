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
