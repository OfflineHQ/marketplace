import { adminSdk } from '@gql/admin/api';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from '@test-utils/db';
import { ContractDeployer, ThirdwebSDK, UserWallet } from '@thirdweb-dev/sdk';
import { BigNumber, Signer } from 'ethers';
import { PackCollection } from './index';

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
const mockedThirdwebSDKInstance = new ThirdwebSDK({} as Signer);
mockedThirdwebSDKInstance.deployer =
  mockDeployer as unknown as ContractDeployer;
mockedThirdwebSDKInstance.wallet = mockSigner as unknown as UserWallet;
mockedThirdwebSDKInstance.getContract = jest
  .fn()
  .mockResolvedValue(mockContract);

jest.mock('@thirdweb-dev/sdk');

describe('PackCollection', () => {
  let packCollection: PackCollection;
  let client: PgClient;

  const pack = {
    id: 'mocked_pack_id',
    organizerId: 'clizzky8kap2t0bw7wka9a2id',
    eventPassIds: [{ id: 'fakeEventPassDelayedRevealId', amount: 2 }],
    rewardsPerPack: 1,
    name: 'mocked_pack_name',
    image: 'mocked_pack_image',
    lotteryId: 'aefawfgw3lkasfhjllasfj', // TODO: set an existing lotteryId from Hygraph ?
  };

  const pack2 = {
    id: 'mocked_pack_id',
    eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 2 }],
    rewardsPerPack: 2,
    name: 'mocked_pack_name',
    image: 'mocked_pack_image',
    organizerId: 'clizzky8kap2t0bw7wka9a2id',
    lotteryId: 'aefawfgw3lkasfhjllasfj', // TODO: set an existing lotteryId from Hygraph ?
  };

  const props = {
    chainIdNumber: 5,
    pack,
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

  beforeAll(async () => {
    client = await createDbClient();
  });

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  beforeEach(async () => {
    await deleteAllTables(client);
    await applySeeds(client, ['passAmount']);
    packCollection = new PackCollection(mockedThirdwebSDKInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('savePackContractIntoDb', () => {
    beforeEach(async () => {
      await applySeeds(client, [
        'nftTransfer',
        'eventPassNft',
        'eventPassNftContract',
      ]);
    });
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteAllTables(client);
    });

    it('should successfully save pack contract into db', async () => {
      await packCollection.savePackContractIntoDb(props);
      const packNftContract = (
        await adminSdk.GetPackNftContractFromPackId({
          packId: props.pack.id,
        })
      ).packNftContract;

      expect(packNftContract[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          chainId: props.chainIdNumber.toString(),
          organizerId: props.pack.organizerId,
          lotteryId: props.pack.lotteryId,
          eventPassNftContracts: props.pack.eventPassIds.map((eventPassId) => ({
            eventPassId: eventPassId.id,
            amount: eventPassId.amount,
          })),
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
    let packCollection: PackCollection;

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
      packCollection = new PackCollection(mockedThirdwebSDKInstance);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully get selected NFTs from pack', async () => {
      const { selectedNfts } =
        await packCollection.getSelectedNftsFromPack(pack2);

      expect(selectedNfts).toEqual([
        {
          id: '52641e81-57cf-4f2d-bdd3-fa56cca377e4',
          packId: null,
          currentOwnerAddress: null,
          contractAddress: '0xFakePack2',
          eventId: 'clizzpvidao620buvxit1ynko',
          tokenId: 0,
          eventPassId: pack2.eventPassIds[0].id,
        },
        {
          id: 'a36f1f0a-8aea-4e47-9300-7373d5feead9',
          packId: null,
          currentOwnerAddress: null,
          contractAddress: '0xFakePack2',
          eventId: 'clizzpvidao620buvxit1ynko',
          tokenId: 1,
          eventPassId: pack2.eventPassIds[0].id,
        },
      ]);
    });

    it("should throw an error if eventPassNftContract doesn't exist", async () => {
      const packNotExisting = {
        ...pack2,
        eventPassIds: [{ id: 'notExistingEventPassId', amount: 2 }],
      };
      await expect(
        packCollection.getSelectedNftsFromPack(packNotExisting),
      ).rejects.toThrow(
        new Error(
          "One of your eventPassId doesn't have an eventPassNftContract",
        ),
      );
    });

    it('should throw an error if not enough available NFTs', async () => {
      const packNotEnoughNfts = {
        ...pack2,
        eventPassIds: [{ id: 'fakeEventPassPackId2', amount: 4 }],
      };

      await expect(
        packCollection.getSelectedNftsFromPack(packNotEnoughNfts),
      ).rejects.toThrow(
        new Error(
          'Not enough available NFTs for eventPassId fakeEventPassPackId2',
        ),
      );
    });
  });
  describe('deployAPack', () => {
    let packCollection: PackCollection;

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
      packCollection = new PackCollection(mockedThirdwebSDKInstance);
      packCollection.deployAndCreatePack = jest
        .fn()
        .mockResolvedValue('fake_tx_result');
      // packCollection.getAddressAndChainId = jest
      //   .fn()
      //   .mockResolvedValue(['mocked_address', 5]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully deploy a pack', async () => {
      await packCollection.deployAPack(pack2);

      const packNftContract = (
        await adminSdk.GetPackNftContractFromPackId({
          packId: pack2.id,
        })
      ).packNftContract;

      expect(packNftContract[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          lotteryId: pack2.lotteryId,
          chainId: '1',
          eventPassNftContracts: [
            {
              amount: pack2.eventPassIds[0].amount,
              eventPassId: pack2.eventPassIds[0].id,
            },
          ],
          organizerId: pack2.organizerId,
          rewardsPerPack: 2,
          contractAddress: 'fake_tx_result',
          eventPassNfts: [
            {
              tokenId: 0,
              packId: pack2.id,
              contractAddress: '0xFakePack2',
              eventPassId: 'fakeEventPassPackId2',
              currentOwnerAddress: null,
            },
            {
              tokenId: 1,
              packId: pack2.id,
              contractAddress: '0xFakePack2',
              eventPassId: 'fakeEventPassPackId2',
              currentOwnerAddress: null,
            },
          ],
        }),
      );

      expect(packCollection.deployAndCreatePack).toHaveBeenCalledWith({
        address: 'mocked_address',
        pack: pack2,
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
    let packCollection: PackCollection;

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
      // TODO: should mock directly the sdk for errors instead of the methods from PackCollection (like in the tests for NftCollection)
      packCollection = new PackCollection(mockedThirdwebSDKInstance);
      packCollection.deployAndCreatePack = jest
        .fn()
        .mockResolvedValue('fake_tx_result');
      // packCollection.getAddressAndChainId = jest
      //   .fn()
      //   .mockResolvedValue(['mocked_address', 5]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if pack is missing required fields', async () => {
      const packWithoutRequiredFields = {
        ...pack2,
        lotteryId: null,
      };
      await expect(
        packCollection.deployAPack(packWithoutRequiredFields),
      ).rejects.toThrow(
        new Error(
          'Error deploying a pack: Missing required field in pack: lotteryId',
        ),
      );
    });

    it('should throw an error if deployAndCreatePack fails', async () => {
      packCollection.deployAndCreatePack = jest
        .fn()
        .mockRejectedValue(new Error('Error in deployAndCreatePack'));

      await expect(packCollection.deployAPack(pack2)).rejects.toThrow(
        new Error('Error deploying a pack: Error in deployAndCreatePack'),
      );
    });

    it('should throw an error if savePackContractIntoDb fails', async () => {
      packCollection.savePackContractIntoDb = jest
        .fn()
        .mockRejectedValue(new Error('Error in savePackContractIntoDb'));

      await expect(packCollection.deployAPack(pack2)).rejects.toThrow(
        new Error('Error deploying a pack: Error in savePackContractIntoDb'),
      );
    });

    it('should throw an error if getSelectedNftsFromPack fails', async () => {
      packCollection.getSelectedNftsFromPack = jest
        .fn()
        .mockRejectedValue(new Error('Error in getSelectedNftsFromPack'));

      await expect(packCollection.deployAPack(pack2)).rejects.toThrow(
        new Error('Error deploying a pack: Error in getSelectedNftsFromPack'),
      );
    });
  });
});
