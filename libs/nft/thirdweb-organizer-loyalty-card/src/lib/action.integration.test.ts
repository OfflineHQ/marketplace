import { KycLevelName_Enum, KycStatus_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from '@test-utils/db';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { loyaltyCardMintTo } from './action';

jest.mock('@next/next-auth/user');
jest.mock('@thirdweb-dev/sdk');

describe('loyaltyCardMintTo', () => {
  let client: PgClient;
  const mockEventPassId = 'fake-event-pass-2';
  const mockMetadata = { name: 'Test NFT', description: 'Test Description' };
  const mockSdk = new ThirdwebSDK('test-chain');
  const mockContract = {
    erc721: {
      mintTo: jest.fn(),
    },
  };

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
  });

  afterEach(async () => {
    await deleteAllTables(client);
  });

  beforeEach(async () => {
    await applySeeds(client, ['eventPassNftContract']);
    jest.clearAllMocks();
    (ThirdwebSDK as jest.MockedClass<typeof ThirdwebSDK>).mockImplementation(
      () => mockSdk,
    );
    mockSdk.getContract = jest.fn().mockReturnValue({
      erc721: {
        mintTo: mockContract.erc721.mintTo,
        generate: jest.fn(),
      },
    });
  });

  it('throws an error if the user has no KYC', async () => {
    (
      getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
    ).mockResolvedValue({ id: 'user-1', kyc: null, address: 'no-kyc' });

    await expect(
      loyaltyCardMintTo(mockEventPassId, mockMetadata, mockSdk),
    ).rejects.toThrow('User user-1 has no kyc');
  });

  it('throws an error if the user KYC is not validated', async () => {
    (
      getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
    ).mockResolvedValue({
      id: 'user-2',
      kyc: {
        applicantId: 'some-applicant-id',
        reviewStatus: KycStatus_Enum.Init,
        levelName: KycLevelName_Enum.AdvancedKycLevel,
      },
      address: 'fail',
    });

    await expect(
      loyaltyCardMintTo(mockEventPassId, mockMetadata, mockSdk),
    ).rejects.toThrow('User user-2 kyc is not validated');
  });

  it('successfully mints an NFT', async () => {
    (
      getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
    ).mockResolvedValue({
      id: 'user-3',
      kyc: {
        applicantId: 'some-applicant-id',
        reviewStatus: KycStatus_Enum.Completed,
        levelName: KycLevelName_Enum.AdvancedKycLevel,
      },
      address: 'user-address',
    });
    mockContract.erc721.mintTo.mockResolvedValue('mint-success');

    const result = await loyaltyCardMintTo(
      mockEventPassId,
      mockMetadata,
      mockSdk,
    );

    expect(result).toBe('mint-success');
    expect(mockContract.erc721.mintTo).toHaveBeenCalledWith(
      'user-address',
      mockMetadata,
    );
  });
});
