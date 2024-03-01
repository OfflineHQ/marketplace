import { adminSdk } from '@gql/admin/api';
import { WebhookType } from '@indexer/alchemy/types';
import { PgClient, createDbClient, deleteAllTables } from '@test-utils/db';
import { ContractDeployer, ThirdwebSDK, UserWallet } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers6';
import { LoyaltyCardCollection } from './index';

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    id: 'user-1',
    address: 'user-1-address',
    role: {
      organizerId: 'organizer-1',
    },
  }),
}));

jest.mock('@features/back-office/loyalty-card-api', () => ({
  ...jest.requireActual('@features/back-office/loyalty-card-api'),
  createWebhooksForLoyaltyCard: jest.fn().mockResolvedValue({
    activityWebhook: {
      type: WebhookType.NFT_ACTIVITY,
      id: 'mocked_webhook_id',
      signingKey: 'mock-signing-key',
    },
    metadataUpdateWebhook: {
      type: WebhookType.NFT_METADATA_UPDATE,
      id: 'mocked_webhook_id_2',
      signingKey: 'mock-signing-key-2',
    },
  }),
}));

jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers'); // Import the actual module

  // Mock the specific method createRandom of the Wallet class
  const mockWallet = {
    ...actualEthers.Wallet,
    createRandom: jest.fn(() => ({
      privateKey:
        '0x8f63072cd9a2618b1987c991f3e3037862a79692ab494510d4079bd09af8327e',
      address: '0xDd43A3A2433c629D0070F052AEd53E7C2a78B4F9',
    })),
  };

  return {
    ...actualEthers,
    Wallet: mockWallet,
    // Ensure other properties and classes of ethers are correctly mocked/spread
    ethers: {
      ...actualEthers.ethers,
      Wallet: mockWallet,
    },
  };
});

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('mockUserAddress'),
  getChainId: jest.fn().mockResolvedValue(1),
};

// Mock the entire ThirdwebSDK class
jest.mock('@thirdweb-dev/sdk');

describe('LoyaltyCardCollection (Integration)', () => {
  let loyaltyCardCollection: LoyaltyCardCollection;
  let client: PgClient;

  const mockDeployer = {
    deployLoyaltyCard: jest.fn().mockImplementation(() => {
      return Promise.resolve('mocked_contract_address');
    }),
  };

  const mockContract = {
    erc721: {
      claimConditions: {
        set: jest.fn(),
      },
      getAll: jest
        .fn()
        .mockResolvedValue([{ metadata: { uri: 'mocked_uri' } }]),
    },
    getAddress: jest.fn().mockReturnValue('mocked_contract_address'),
  };
  const mockedThirdwebSDKInstance = new ThirdwebSDK({} as Signer);
  mockedThirdwebSDKInstance.deployer =
    mockDeployer as unknown as ContractDeployer;
  mockedThirdwebSDKInstance.wallet = mockSigner as unknown as UserWallet;
  mockedThirdwebSDKInstance.getContract = jest
    .fn()
    .mockResolvedValue(mockContract);

  beforeAll(async () => {
    client = await createDbClient();
  });

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  beforeEach(async () => {
    // mockFromSigner.mockReset();
    await deleteAllTables(client);
    // await applySeeds(client, ['loyaltyCardParameters']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should deploy a loyalty card collection and create associated records', async () => {
    const props = {
      id: 'test-loyalty-card-id',
      organizerId: 'test-organizer-id',
      nftImage: { url: 'test-image-url' },
      nftName: 'Test Loyalty Card',
      amount: 10,
    };
    loyaltyCardCollection = new LoyaltyCardCollection(
      mockedThirdwebSDKInstance,
    );
    const mintPasswords =
      await loyaltyCardCollection.deployLoyaltyCardCollection(props);
    // Check if the mint passwords are returned
    expect(mintPasswords).toBeDefined();
    expect(mintPasswords.length).toBe(props.amount);

    const minterTemporaryWallet = (
      await adminSdk.GetMinterTemporaryWalletByLoyaltyCardId({
        loyaltyCardId: props.id,
      })
    ).minterTemporaryWallet;

    expect(minterTemporaryWallet[0]).toStrictEqual({
      privateKey:
        '0x8f63072cd9a2618b1987c991f3e3037862a79692ab494510d4079bd09af8327e',
      address: '0xdd43a3a2433c629d0070f052aed53e7c2a78b4f9',
      loyaltyCardId: props.id,
    });

    const nftMintPasswords = (
      await adminSdk.GetNftMintPasswordsForContract({
        contractAddress: 'mocked_contract_address',
        chainId: '1',
      })
    ).nftMintPassword;

    expect(nftMintPasswords).toBeDefined();
    expect(nftMintPasswords.length).toBe(props.amount);

    const loyaltyCardContract = (
      await adminSdk.GetLoyaltyCardNftContractByLoyaltyCardId({
        loyaltyCardId: props.id,
      })
    ).loyaltyCardNftContract;

    expect(loyaltyCardContract[0]).toStrictEqual({
      chainId: '1',
      contractAddress: 'mocked_contract_address',
    });

    const alchemyInfos = (
      await adminSdk.GetAlchemyInfosFromLoyaltyCardId({
        loyaltyCardId: props.id,
      })
    ).loyaltyCardParameters[0];

    expect(alchemyInfos).toEqual({
      id: alchemyInfos.id,
      activityWebhookId: 'mocked_webhook_id',
      activityWebhookSigningKey: 'mock-signing-key',
      metadataUpdateWebhookId: 'mocked_webhook_id_2',
      metadataUpdateWebhookSigningKey: 'mock-signing-key-2',
    });
  });
});
