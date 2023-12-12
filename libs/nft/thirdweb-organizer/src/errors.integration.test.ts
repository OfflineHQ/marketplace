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
import { BigNumber } from 'ethers';
import NftCollection from './index';

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

const ThirdwebSDKMock = {
  fromSigner: jest.fn().mockReturnValue({
    wallet: mockSigner,
    deployer: mockDeployer,
    getContract: jest.fn().mockResolvedValue(mockContract),
  }),
};

jest.mock('@thirdweb-dev/sdk');

describe('NftCollection', () => {
  let nftCollection: NftCollection;
  let mockSigner;
  let client: PgClient;
  const eventPassEventSlug = 'test-an-event';
  const eventPassOrganizerId = 'clizzky8kap2t0bw7wka9a2id';

  beforeAll(async () => {
    client = await createDbClient();
    (ThirdwebSDK as unknown as jest.Mock).mockImplementation(
      () => ThirdwebSDKMock,
    );
  });

  beforeEach(async () => {
    mockSigner = {};
    nftCollection = new NftCollection(mockSigner);
    await deleteAllTables(client);
    await applySeeds(client, ['eventPassPricing']);
  });

  describe('deployACollection', () => {
    it('should throw an error when createDelayedRevealBatch fails', async () => {
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
      ).rejects.toThrow();

      event = (
        await adminSdk.GetEventWithPassesOrganizer({
          slug: eventPassEventSlug,
          locale: 'en' as Locale,
          stage: Stage.Draft,
        })
      ).event;

      expect(event.eventPasses[1].eventPassNftContract).toBeNull();
    });
  });
});
