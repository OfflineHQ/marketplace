import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { EventPassCollection } from './index';

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('mocked_address'),
  getChainId: jest.fn().mockResolvedValue(1),
};

const mockDeployer = {
  deployBuiltInContract: jest.fn().mockResolvedValue('mocked_contract_address'),
};
const mockContract = {
  erc721: {
    lazyMint: jest
      .fn()
      .mockResolvedValue([{ data: () => ({ uri: 'mocked_uri' }) }]),
    revealer: {
      createDelayedRevealBatch: jest.fn(),
    },
    claimConditions: {
      set: jest.fn(),
    },
    getAll: jest.fn().mockResolvedValue([{ metadata: { uri: 'mocked_uri' } }]),
  },
  getAddress: jest.fn().mockReturnValue('mocked_contract_address'),
};

jest.mock('@thirdweb-dev/sdk');

const mockSdk = {
  wallet: mockSigner,
  deployer: mockDeployer,
  getContract: jest.fn().mockResolvedValue(mockContract),
} as any as ThirdwebSDK;

describe('EventPassCollection', () => {
  describe('deployEventPassCollection', () => {
    let eventPassCollection;
    let mockEventPass;
    let mockEventData;

    beforeAll(() => {
      eventPassCollection = new EventPassCollection(mockSdk);
      mockEventPass = {};
      mockEventData = {};
      eventPassCollection.getEventPassCommonProps = jest
        .fn()
        .mockImplementation(() => {
          return {
            name: 'Test Name',
            address: 'Test Address',
            id: 'Test ID',
            chainId: 'Test ChainId',
            eventId: 'Test EventId',
            organizerId: 'Test OrganizerId',
            eventSlug: 'Test EventSlug',
            nftImage: 'Test NftImage',
            nftDescription: 'Test NftDescription',
            nftName: 'Test NftName',
            passAmount: {
              maxAmount: 10,
            },
          };
        });
      eventPassCollection.deployAnEventPassNftDropCollection = jest.fn();
      eventPassCollection.deployEventPassDelayedRevealCollection = jest.fn();
    });

    it('should deploy a normal collection', async () => {
      await eventPassCollection.deployEventPassCollection(
        mockEventPass,
        mockEventData,
        EventPassNftContractType_Enum.Normal,
      );
      expect(
        eventPassCollection.deployAnEventPassNftDropCollection,
      ).toHaveBeenCalled();
    });

    it('should deploy a delayed reveal collection', async () => {
      await eventPassCollection.deployEventPassCollection(
        mockEventPass,
        mockEventData,
        EventPassNftContractType_Enum.DelayedReveal,
      );
      expect(
        eventPassCollection.deployEventPassDelayedRevealCollection,
      ).toHaveBeenCalled();
    });

    it('should throw an error for an invalid type', async () => {
      await expect(
        eventPassCollection.deployEventPassCollection(
          mockEventPass,
          mockEventData,
          'invalid_type',
        ),
      ).rejects.toThrow(
        "The type argument 'invalid_type' is not in the EventPassNftContractType_Enum",
      );
    });

    it('should throw a CollectionDeploymentError if an error occurs', async () => {
      eventPassCollection.getEventPassCommonProps.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await expect(
        eventPassCollection.deployEventPassCollection(
          mockEventPass,
          mockEventData,
          EventPassNftContractType_Enum.Normal,
        ),
      ).rejects.toThrow('Error deploying an event pass: Test error');
    });
  });

  describe('createEventPassMetadatas', () => {
    let eventPassCollection;
    let mockMetadata;

    beforeAll(() => {
      eventPassCollection = new EventPassCollection(mockSdk);
      mockMetadata = {
        name: 'Test Name',
        description: 'Test Description',
        image: 'Test Image',
      };
    });

    it('should create correct number of metadatas for variable length', () => {
      const length = Math.floor(Math.random() * 42) + 1;
      const metadatas = eventPassCollection.createEventPassMetadatas(
        length,
        mockMetadata,
        'organizerId',
        'eventId',
        'eventPassId',
      );
      expect(metadatas.length).toBe(length);
    });

    it('should create metadatas with correct properties', () => {
      const metadatas = eventPassCollection.createEventPassMetadatas(
        1,
        mockMetadata,
        'organizerId',
        'eventId',
        'eventPassId',
      );
      const metadata = metadatas[0];
      expect(metadata.name).toBe(mockMetadata.name);
      expect(metadata.description).toBe(mockMetadata.description);
      expect(metadata.image).toBe(mockMetadata.image);
      expect(metadata.external_url).toBe(
        `https://www.offline.live/pass/organizer/organizerId/event/eventId/eventPass/eventPassId/0`,
      );
    });
  });

  describe('createEventPassHasuraMetadatas', () => {
    let eventPassCollection;

    beforeAll(() => {
      eventPassCollection = new EventPassCollection(mockSdk);
    });

    it('should create correct number of Hasura metadatas for variable length', async () => {
      const length = Math.floor(Math.random() * 42) + 1;
      const metadatas = Array.from({ length }, () => ({
        name: 'Test Name',
        description: 'Test Description',
        image: 'Test Image',
        external_url: 'Test URL',
      }));
      const results = Array.from({ length }, (_, i) => ({ id: `${i + 1}` }));

      const hasuraMetadatas =
        await eventPassCollection.createEventPassHasuraMetadatas(
          metadatas,
          results,
          'Test BaseUri',
          'Test ChainId',
          'Test OrganizerId',
          'Test EventId',
          'Test EventPassId',
          'Test TxResult',
        );

      expect(hasuraMetadatas.length).toBe(length);
    });

    it('should create Hasura metadatas with correct properties', async () => {
      const metadatas = [
        {
          name: 'Test Name',
          description: 'Test Description',
          image: 'Test Image',
          external_url: 'Test URL',
        },
      ];
      const results = [
        {
          id: '1',
        },
      ];
      const baseUri = 'Test BaseUri';
      const chainId = 'Test ChainId';
      const organizerId = 'Test OrganizerId';
      const eventId = 'Test EventId';
      const eventPassId = 'Test EventPassId';
      const txResult = 'Test TxResult';

      const hasuraMetadatas =
        await eventPassCollection.createEventPassHasuraMetadatas(
          metadatas,
          results,
          baseUri,
          chainId,
          organizerId,
          eventId,
          eventPassId,
          txResult,
        );

      const hasuraMetadata = hasuraMetadatas[0];
      expect(hasuraMetadata.metadata).toBe(metadatas[0]);
      expect(hasuraMetadata.chainId).toBe(chainId);
      expect(hasuraMetadata.tokenId).toBe(1);
      expect(hasuraMetadata.tokenUri).toBe(`${baseUri}1`);
      expect(hasuraMetadata.organizerId).toBe(organizerId);
      expect(hasuraMetadata.eventId).toBe(eventId);
      expect(hasuraMetadata.eventPassId).toBe(eventPassId);
      expect(hasuraMetadata.contractAddress).toBe(txResult);
    });
  });

  describe('deployEventPassDropContractAndPrepareMetadata', () => {
    let eventPassCollection;
    let mockProps;

    beforeAll(() => {
      mockProps = {
        name: 'Test Name',
        address: 'Test Address',
        id: 'Test ID',
        eventId: 'Test EventId',
        organizerId: 'Test OrganizerId',
        eventSlug: 'Test EventSlug',
        nftImage: { url: 'Test NftImage' },
        nftDescription: 'Test NftDescription',
        nftName: 'Test NftName',
        passAmount: {
          maxAmount: 10,
        },
      };
    });

    it('should deploy a contract and prepare metadata', async () => {
      eventPassCollection = new EventPassCollection(mockSdk);

      const result =
        await eventPassCollection.deployEventPassDropContractAndPrepareMetadata(
          mockProps,
        );

      expect(result).toHaveProperty('contract');
      expect(result).toHaveProperty('metadatas');
      expect(result.metadatas.length).toBe(mockProps.passAmount.maxAmount);
      expect(result.contract.getAddress()).toBe('mocked_contract_address');
    });

    it('should throw a CollectionDeploymentError if an error occurs', async () => {
      const mockSdkError = {
        deployer: {
          deployBuiltInContract: jest
            .fn()
            .mockImplementationOnce(() => {
              throw new Error('Test error');
            })
            .mockResolvedValue('mocked_contract_address'),
        },
        getContract: jest.fn().mockResolvedValue(mockContract),
      } as any as ThirdwebSDK;
      eventPassCollection = new EventPassCollection(mockSdkError);
      await expect(
        eventPassCollection.deployEventPassDropContractAndPrepareMetadata(
          mockProps,
        ),
      ).rejects.toThrow('Error deploying a drop contract : Test error');
    });
  });
});
