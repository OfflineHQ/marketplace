import { adminSdk } from '@gql/admin/api';
import {
  EventPassNftContractType_Enum,
  Locale,
  Stage,
} from '@gql/shared/types';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from '@test-utils/db';
import { ContractDeployer, ThirdwebSDK, UserWallet } from '@thirdweb-dev/sdk';
import { BigNumber, Signer } from 'ethers';
import { NftCollection } from './index';

jest.mock('@features/pass-api', () => ({
  ...jest.requireActual('@features/pass-api'),
  createNftActivityWebhookForEvent: jest.fn().mockResolvedValue({
    id: 'mocked_webhook_id',
    signingKey: 'mocked_signing_key',
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
  getAddress: jest.fn().mockResolvedValue('mocked_address'),
  getChainId: jest.fn().mockResolvedValue(1),
};

// Mock the entire ThirdwebSDK class
jest.mock('@thirdweb-dev/sdk');

describe('NftCollection', () => {
  let nftCollection: NftCollection;
  let client: PgClient;
  const eventPassEventSlug = 'test-an-event';
  const eventPassOrganizerId = 'clizzky8kap2t0bw7wka9a2id';

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
    await applySeeds(client, ['passAmount']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deployACollection - happy path', () => {
    const mockDeployer = {
      deployBuiltInContract: jest.fn().mockImplementation(() => {
        return Promise.resolve('mocked_contract_address');
      }),
    };

    const mockContract = {
      erc721: {
        lazyMint: jest.fn((metadatas) =>
          Promise.resolve(
            Array.from({ length: metadatas.length }, (_, i) => ({
              id: BigNumber.from(i + 1),
              data: () => Promise.resolve({ uri: `ipfs://${i + 1}` }),
            })),
          ),
        ),
        revealer: {
          createDelayedRevealBatch: jest.fn((_, metadatas, __) =>
            Promise.resolve(
              Array.from({ length: metadatas.length }, (_, i) => ({
                id: BigNumber.from(i + 1),
                data: () => Promise.resolve({ uri: `ipfs://${i + 1}` }),
              })),
            ),
          ),
        },
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
    it('should successfully deploy a NFT drop collection', async () => {
      nftCollection = new NftCollection(mockedThirdwebSDKInstance);
      let event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;
      await expect(
        nftCollection.deployACollection(
          event.eventPasses[0],
          {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId: eventPassOrganizerId,
          },
          EventPassNftContractType_Enum.Normal,
        ),
      ).resolves.not.toThrow();

      const alchemyInfos = (
        await adminSdk.GetAlchemyInfosFromEventId({
          eventId: event.id,
        })
      ).eventParameters[0];

      expect(alchemyInfos).toEqual({
        activityWebhookId: 'mocked_webhook_id',
        signingKey: 'mocked_signing_key',
      });

      event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      const minterTemporaryWallet = (
        await adminSdk.GetMinterTemporaryWalletByEventPassId({
          eventPassId: event.eventPasses[0].id,
        })
      ).minterTemporaryWallet;
      expect(event.eventPasses[0].eventPassNftContract.type).toBe(
        EventPassNftContractType_Enum.Normal,
      );
      expect(event.eventPasses[0].eventPassNftContract.contractAddress).toBe(
        'mocked_contract_address',
      );
      expect(minterTemporaryWallet[0]).toStrictEqual({
        privateKey:
          '0x8f63072cd9a2618b1987c991f3e3037862a79692ab494510d4079bd09af8327e',
        address: '0xdd43a3a2433c629d0070f052aed53e7c2a78b4f9',
        eventPassId: event.eventPasses[0].id,
      });
    });

    it('should successfully deploy a Delayed Reveal collection', async () => {
      nftCollection = new NftCollection(mockedThirdwebSDKInstance);

      let event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      await expect(
        nftCollection.deployACollection(
          event.eventPasses[1],
          {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId: eventPassOrganizerId,
          },
          EventPassNftContractType_Enum.DelayedReveal,
        ),
      ).resolves.not.toThrow();

      const alchemyInfos = (
        await adminSdk.GetAlchemyInfosFromEventId({
          eventId: event.id,
        })
      ).eventParameters[0];

      expect(alchemyInfos).toEqual({
        activityWebhookId: 'mocked_webhook_id',
        signingKey: 'mocked_signing_key',
      });

      event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      const minterTemporaryWallet = (
        await adminSdk.GetMinterTemporaryWalletByEventPassId({
          eventPassId: event.eventPasses[1].id,
        })
      ).minterTemporaryWallet;

      expect(event.eventPasses[1].eventPassNftContract.type).toBe(
        EventPassNftContractType_Enum.DelayedReveal,
      );
      expect(event.eventPasses[1].eventPassNftContract.contractAddress).toBe(
        'mocked_contract_address',
      );
      expect(minterTemporaryWallet[0]).toStrictEqual({
        privateKey:
          '0x8f63072cd9a2618b1987c991f3e3037862a79692ab494510d4079bd09af8327e',
        address: '0xdd43a3a2433c629d0070f052aed53e7c2a78b4f9',
        eventPassId: event.eventPasses[1].id,
      });
    });
  });

  describe('deployACollection - errors', () => {
    beforeAll(() => {
      const mockErrorDeployer = {
        deployBuiltInContract: jest
          .fn()
          .mockImplementationOnce(() => {
            throw new Error('Error in deployBuiltInContract');
          })
          .mockImplementation(() => 'mocked_contract_address'),
      };
      const mockedThirdwebSDKInstance = new ThirdwebSDK({} as Signer);
      mockedThirdwebSDKInstance.deployer =
        mockErrorDeployer as unknown as ContractDeployer;
      mockedThirdwebSDKInstance.wallet = mockSigner as unknown as UserWallet;
      mockedThirdwebSDKInstance.getContract = jest.fn().mockResolvedValue({
        erc721: {
          lazyMint: jest.fn().mockImplementation(() => {
            throw new Error('Error in lazyMint');
          }),
          revealer: {
            createDelayedRevealBatch: jest.fn().mockImplementation(() => {
              throw new Error('Error in createDelayedRevealBatch');
            }),
          },
          claimConditions: {
            set: jest.fn(),
          },
          getAll: jest
            .fn()
            .mockResolvedValue([{ metadata: { uri: 'mocked_uri' } }]),
        },
        getAddress: jest.fn().mockReturnValue('mocked_contract_address'),
      });
      nftCollection = new NftCollection(mockedThirdwebSDKInstance);
    });
    it('should throw an error if deployBuiltInContract fail', async () => {
      const event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      await expect(
        nftCollection.deployACollection(
          event.eventPasses[0],
          {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId: eventPassOrganizerId,
          },
          EventPassNftContractType_Enum.Normal,
        ),
      ).rejects.toThrow(
        new Error(
          'Error deploying a collection: Error deploying a normal collection : Error deploying a drop contract : Error in deployBuiltInContract',
        ),
      );
    });

    it('should throw an error if deployAnNftDropCollection fail', async () => {
      const event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      await expect(
        nftCollection.deployACollection(
          event.eventPasses[0],
          {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId: eventPassOrganizerId,
          },
          EventPassNftContractType_Enum.Normal,
        ),
      ).rejects.toThrow(
        new Error(
          'Error deploying a collection: Error deploying a normal collection : Error in lazyMint',
        ),
      );
    });
    it('should throw an error if deployDelayedRevealCollection fail', async () => {
      const event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      await expect(
        nftCollection.deployACollection(
          event.eventPasses[1],
          {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId: eventPassOrganizerId,
          },
          EventPassNftContractType_Enum.DelayedReveal,
        ),
      ).rejects.toThrow(
        new Error(
          'Error deploying a collection: Error deploying a delayed reveal collection : Error in createDelayedRevealBatch',
        ),
      );
    });
  });

  describe('revealDelayedContract', () => {
    let nftCollection: NftCollection;
    let mockedThirdwebSDKInstance: ThirdwebSDK;
    let mockContract: any;
    const contractAddress = '0xfakedelayedreveal';

    beforeEach(async () => {
      mockContract = {
        erc721: {
          revealer: {
            reveal: jest.fn().mockResolvedValue(undefined),
          },
        },
        getAddress: jest.fn().mockReturnValue(contractAddress),
      };

      mockedThirdwebSDKInstance = new ThirdwebSDK({} as Signer);
      mockedThirdwebSDKInstance.getContract = jest
        .fn()
        .mockResolvedValue(mockContract);

      nftCollection = new NftCollection(mockedThirdwebSDKInstance);

      adminSdk.UpdateEventPassNftContractDelayedRevealStatus = jest
        .fn()
        .mockResolvedValue({
          update_eventPassNftContract_by_pk: { isDelayedRevealed: true },
        });

      adminSdk.GetListCurrentOwnerAddressForContractAddress = jest
        .fn()
        .mockResolvedValue({
          eventPassNft: ['0xowner1', '0xowner2'],
        });
      await applySeeds(client, [
        'eventPassNftContract',
        'eventParameters',
        'nftTransfer',
        'eventPassNft',
      ]);
    });

    afterEach(async () => {
      await deleteAllTables(client);
    });

    it('should update the status of isDelayedReveal and return the list of currentOwnerAddress', async () => {
      const owners = await nftCollection.revealDelayedContract(contractAddress);

      expect(mockContract.erc721.revealer.reveal).toHaveBeenCalledWith(
        0,
        expect.any(String),
      );
      expect(
        adminSdk.UpdateEventPassNftContractDelayedRevealStatus,
      ).toHaveBeenCalledWith({
        contractAddress,
      });
      expect(owners).toEqual({
        eventPassNft: ['0xowner1', '0xowner2'],
      });
    });

    it('should throw an error when reveal fails', async () => {
      mockContract.erc721.revealer.reveal.mockRejectedValueOnce(
        new Error('reveal failed'),
      );

      await expect(
        nftCollection.revealDelayedContract(contractAddress),
      ).rejects.toThrowError(
        `Error revealing the delayed contract at address ${contractAddress} : reveal failed`,
      );
    });

    it('should throw an error when update reveal status fails', async () => {
      adminSdk.UpdateEventPassNftContractDelayedRevealStatus = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('update failed');
        });

      await expect(
        nftCollection.revealDelayedContract(contractAddress),
      ).rejects.toThrowError(
        `Error saving the reveal status into the database for address ${contractAddress} : update failed`,
      );
    });
  });
});
