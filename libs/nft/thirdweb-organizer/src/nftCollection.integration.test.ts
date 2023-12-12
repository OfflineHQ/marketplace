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
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { BigNumber, Signer } from 'ethers';
import NftCollection from './index';

jest.mock('@features/pass-api', () => ({
  ...jest.requireActual('@features/pass-api'),
  createNftActivityWebhookForEvent: jest.fn().mockResolvedValue({
    id: 'mocked_webhook_id',
    signingKey: 'mocked_signing_key',
  }),
}));

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('mocked_address'),
  getChainId: jest.fn().mockResolvedValue(1),
};

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
    getAll: jest.fn().mockResolvedValue([{ metadata: { uri: 'mocked_uri' } }]),
  },
  getAddress: jest.fn().mockReturnValue('mocked_contract_address'),
};

jest.mock('@thirdweb-dev/sdk');
const mockFromSigner = ThirdwebSDK.fromSigner as jest.Mock;

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
    mockFromSigner.mockReset();
    await deleteAllTables(client);
    await applySeeds(client, ['eventPassPricing']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deployACollection - happy path', () => {
    beforeEach(() => {
      mockFromSigner.mockReturnValue({
        wallet: mockSigner,
        deployer: mockDeployer,
        getContract: jest.fn().mockResolvedValue(mockContract),
      });
    });

    it('should successfully deploy a NFT drop collection', async () => {
      nftCollection = new NftCollection({} as Signer);

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
      expect(event.eventPasses[0].eventPassNftContract.type).toBe(
        EventPassNftContractType_Enum.Normal,
      );
      expect(event.eventPasses[0].eventPassNftContract.contractAddress).toBe(
        'mocked_contract_address',
      );
    });

    it('should successfully deploy a Delayed Reveal collection', async () => {
      nftCollection = new NftCollection({} as Signer);

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

      expect(event.eventPasses[1].eventPassNftContract.type).toBe(
        EventPassNftContractType_Enum.DelayedReveal,
      );
      expect(event.eventPasses[1].eventPassNftContract.contractAddress).toBe(
        'mocked_contract_address',
      );
    });
  });

  describe('deployACollection - errors', () => {
    beforeAll(() => {
      mockFromSigner.mockReturnValue({
        wallet: mockSigner,
        deployer: {
          deployBuiltInContract: jest.fn().mockImplementationOnce(() => {
            throw new Error('Error in deployBuiltInContract');
          }),
        },
        getContract: jest.fn().mockResolvedValue({
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
        }),
      });
      nftCollection = new NftCollection({} as Signer);
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
});
