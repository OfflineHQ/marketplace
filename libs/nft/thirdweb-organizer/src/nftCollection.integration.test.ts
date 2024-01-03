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
    await applySeeds(client, ['passAmount']);
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

  describe('savePackContractIntoDb', () => {
    const props = {
      chainIdNumber: 5,
      pack: {
        id: 'mocked_pack_id',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
        eventPassIds: [{ id: 'fakeEventPassDelayedRevealId', amount: 1 }],
        rewardsPerPack: 1,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        eventId: 'clizzpvidao620buvxit1ynko',
      },
      txResult: 'mocked_tx_result',
      selectedNfts: [
        {
          contractAddress: '0xFakeDelayedReveal',
          tokenId: 0,
        },
        {
          contractAddress: '0xFakeDelayedReveal',
          tokenId: 1,
        },
      ],
    };
    beforeEach(async () => {
      await applySeeds(client, ['nftTransfer', 'eventPassNft']);
    });
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteAllTables(client);
    });

    it('should successfully save pack contract into db', async () => {
      await nftCollection.savePackContractIntoDb(props);
      const packNftContract = (
        await adminSdk.GetPackNftContractFromPackId({
          packId: props.pack.id,
        })
      ).packNftContract;

      expect(packNftContract[0]).toEqual(
        expect.objectContaining({
          chainId: props.chainIdNumber.toString(),
          organizerId: props.pack.organizerId,
          eventPassIds: props.pack.eventPassIds,
          rewardsPerPack: props.pack.rewardsPerPack,
          contractAddress: props.txResult,
          eventPassNfts: [
            {
              tokenId: 0,
              packId: props.pack.id,
              contractAddress: '0xFakeDelayedReveal',
              eventPassId: 'fakeEventPassDelayedRevealId',
              currentOwnerAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
            {
              tokenId: 1,
              packId: props.pack.id,
              contractAddress: '0xFakeDelayedReveal',
              eventPassId: 'fakeEventPassDelayedRevealId',
              currentOwnerAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
            },
          ],
        }),
      );
    });
  });
  describe('getSelectedNftsFromPack', () => {
    let nftCollection: NftCollection;

    beforeAll(async () => {});

    afterAll(async () => {
      await deleteAllTables(client);
    });

    beforeEach(async () => {
      await deleteAllTables(client);
      await applySeeds(client, [
        'nftTransfer',
        'eventPassNft',
        'eventPassNftContract',
      ]);
      nftCollection = new NftCollection({} as Signer);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully get selected NFTs from pack', async () => {
      const pack = {
        id: 'mocked_pack_id',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 1,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
      };

      const { selectedNfts } =
        await nftCollection.getSelectedNftsFromPack(pack);

      expect(selectedNfts).toEqual([
        {
          id: '52641e81-57cf-4f2d-bdd3-fa56cca377e4',
          packId: null,
          currentOwnerAddress: null,
          contractAddress: '0xFakePack2',
          eventId: 'clizzpvidao620buvxit1ynko',
          tokenId: 0,
          eventPassId: 'fakeEventPassPackId2',
        },
        {
          id: 'a36f1f0a-8aea-4e47-9300-7373d5feead9',
          packId: null,
          currentOwnerAddress: null,
          contractAddress: '0xFakePack2',
          eventId: 'clizzpvidao620buvxit1ynko',
          tokenId: 1,
          eventPassId: 'fakeEventPassPackId2',
        },
      ]);
    });

    it("should throw an error if eventPassNftContract doesn't exist", async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'notExistingEventPassId', amount: 2 }],
        rewardsPerPack: 1,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      await expect(nftCollection.getSelectedNftsFromPack(pack)).rejects.toThrow(
        new Error(
          "One of your eventPassId doesn't have an eventPassNftContract",
        ),
      );
    });

    it('should throw an error if not enough available NFTs', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 4 }],
        rewardsPerPack: 1,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      await expect(nftCollection.getSelectedNftsFromPack(pack)).rejects.toThrow(
        new Error(
          'Not enough available NFTs for eventPassId fakeEventPassPackId2',
        ),
      );
    });
  });
  describe('deployAPack', () => {
    let nftCollection: NftCollection;

    beforeAll(async () => {});

    afterAll(async () => {
      await deleteAllTables(client);
    });

    beforeEach(async () => {
      await deleteAllTables(client);
      await applySeeds(client, [
        'nftTransfer',
        'eventPassNft',
        'eventPassNftContract',
      ]);
      nftCollection = new NftCollection({} as Signer);
      nftCollection.deployAndCreatePack = jest
        .fn()
        .mockResolvedValue('fake_tx_result');
      nftCollection.getAddressAndChainId = jest
        .fn()
        .mockResolvedValue(['mocked_address', 5]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully deploy a pack', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 2,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };
      await nftCollection.deployAPack(pack);

      const packNftContract = (
        await adminSdk.GetPackNftContractFromPackId({
          packId: pack.id,
        })
      ).packNftContract;

      expect(packNftContract[0]).toEqual(
        expect.objectContaining({
          chainId: '5',
          eventPassIds: [
            {
              amount: 2,
              id: 'fakeEventPassPackId2',
            },
          ],
          organizerId: 'clizzky8kap2t0bw7wka9a2id',
          rewardsPerPack: 2,
          contractAddress: 'fake_tx_result',
          eventPassNfts: [
            {
              tokenId: 0,
              packId: pack.id,
              contractAddress: '0xFakePack2',
              eventPassId: 'fakeEventPassPackId2',
              currentOwnerAddress: null,
            },
            {
              tokenId: 1,
              packId: pack.id,
              contractAddress: '0xFakePack2',
              eventPassId: 'fakeEventPassPackId2',
              currentOwnerAddress: null,
            },
          ],
        }),
      );

      expect(nftCollection.deployAndCreatePack).toHaveBeenCalledWith({
        address: 'mocked_address',
        pack,
        selectedNfts: [
          {
            id: '52641e81-57cf-4f2d-bdd3-fa56cca377e4',
            packId: null,
            currentOwnerAddress: null,
            contractAddress: '0xFakePack2',
            eventId: 'clizzpvidao620buvxit1ynko',
            tokenId: 0,
            eventPassId: 'fakeEventPassPackId2',
          },
          {
            id: 'a36f1f0a-8aea-4e47-9300-7373d5feead9',
            packId: null,
            currentOwnerAddress: null,
            contractAddress: '0xFakePack2',
            eventId: 'clizzpvidao620buvxit1ynko',
            tokenId: 1,
            eventPassId: 'fakeEventPassPackId2',
          },
        ],
        approvalData: [
          {
            contractAddress: '0xFakePack2',
            eventPassId: 'fakeEventPassPackId2',
          },
        ],
      });
    });
  });

  describe('deployAPack - errors', () => {
    let nftCollection: NftCollection;

    beforeAll(async () => {});

    afterAll(async () => {
      await deleteAllTables(client);
    });

    beforeEach(async () => {
      await deleteAllTables(client);
      await applySeeds(client, [
        'nftTransfer',
        'eventPassNft',
        'eventPassNftContract',
      ]);
      nftCollection = new NftCollection({} as Signer);
      nftCollection.deployAndCreatePack = jest
        .fn()
        .mockResolvedValue('fake_tx_result');
      nftCollection.getAddressAndChainId = jest
        .fn()
        .mockResolvedValue(['mocked_address', 5]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if pack is missing required fields', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 2,
        name: '',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      await expect(nftCollection.deployAPack(pack)).rejects.toThrow(
        new Error(
          'Error deploying a pack: Missing required field in pack: name',
        ),
      );
    });

    it('should throw an error if deployAndCreatePack fails', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 2,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      nftCollection.deployAndCreatePack = jest
        .fn()
        .mockRejectedValue(new Error('Error in deployAndCreatePack'));

      await expect(nftCollection.deployAPack(pack)).rejects.toThrow(
        new Error('Error deploying a pack: Error in deployAndCreatePack'),
      );
    });

    it('should throw an error if savePackContractIntoDb fails', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 2,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      nftCollection.savePackContractIntoDb = jest
        .fn()
        .mockRejectedValue(new Error('Error in savePackContractIntoDb'));

      await expect(nftCollection.deployAPack(pack)).rejects.toThrow(
        new Error('Error deploying a pack: Error in savePackContractIntoDb'),
      );
    });

    it('should throw an error if getSelectedNftsFromPack fails', async () => {
      const pack = {
        id: 'mocked_pack_id',
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
        rewardsPerPack: 2,
        name: 'mocked_pack_name',
        image: 'mocked_pack_image',
        organizerId: 'clizzky8kap2t0bw7wka9a2id',
      };

      nftCollection.getSelectedNftsFromPack = jest
        .fn()
        .mockRejectedValue(new Error('Error in getSelectedNftsFromPack'));

      await expect(nftCollection.deployAPack(pack)).rejects.toThrow(
        new Error('Error deploying a pack: Error in getSelectedNftsFromPack'),
      );
    });
  });
});
