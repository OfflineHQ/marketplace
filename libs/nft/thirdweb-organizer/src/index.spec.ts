import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { NftCollection } from './index';

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

describe('NftCollection', () => {
  describe('deployACollection', () => {
    let nftCollection;
    let mockEventPass;
    let mockEventData;

    beforeAll(() => {
      nftCollection = new NftCollection(mockSdk);
      mockEventPass = {};
      mockEventData = {};
      nftCollection.getCommonProps = jest.fn().mockImplementation(() => {
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
      nftCollection.deployAnNftDropCollection = jest.fn();
      nftCollection.deployDelayedRevealCollection = jest.fn();
    });

    it('should deploy a normal collection', async () => {
      await nftCollection.deployACollection(
        mockEventPass,
        mockEventData,
        EventPassNftContractType_Enum.Normal,
      );
      expect(nftCollection.deployAnNftDropCollection).toHaveBeenCalled();
    });

    it('should deploy a delayed reveal collection', async () => {
      await nftCollection.deployACollection(
        mockEventPass,
        mockEventData,
        EventPassNftContractType_Enum.DelayedReveal,
      );
      expect(nftCollection.deployDelayedRevealCollection).toHaveBeenCalled();
    });

    it('should throw an error for an invalid type', async () => {
      await expect(
        nftCollection.deployACollection(
          mockEventPass,
          mockEventData,
          'invalid_type',
        ),
      ).rejects.toThrow(
        "The type argument 'invalid_type' is not in the EventPassNftContractType_Enum",
      );
    });

    it('should throw a CollectionDeploymentError if an error occurs', async () => {
      nftCollection.getCommonProps.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await expect(
        nftCollection.deployACollection(
          mockEventPass,
          mockEventData,
          EventPassNftContractType_Enum.Normal,
        ),
      ).rejects.toThrow('Error deploying a collection: Test error');
    });
  });

  describe('createMetadatas', () => {
    let nftCollection;
    let mockMetadata;

    beforeAll(() => {
      nftCollection = new NftCollection(mockSdk);
      mockMetadata = {
        name: 'Test Name',
        description: 'Test Description',
        image: 'Test Image',
      };
    });

    it('should create correct number of metadatas for variable length', () => {
      const length = Math.floor(Math.random() * 42) + 1;
      const metadatas = nftCollection.createMetadatas(
        length,
        mockMetadata,
        'organizerId',
        'eventId',
        'eventPassId',
      );
      expect(metadatas.length).toBe(length);
    });

    it('should create metadatas with correct properties', () => {
      const metadatas = nftCollection.createMetadatas(
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

  describe('createHasuraMetadatas', () => {
    let nftCollection;

    beforeAll(() => {
      nftCollection = new NftCollection(mockSdk);
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

      const hasuraMetadatas = await nftCollection.createHasuraMetadatas(
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

      const hasuraMetadatas = await nftCollection.createHasuraMetadatas(
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

  describe('deployDropContractAndPrepareMetadata', () => {
    let nftCollection;
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
      nftCollection = new NftCollection(mockSdk);

      const result =
        await nftCollection.deployDropContractAndPrepareMetadata(mockProps);

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
      nftCollection = new NftCollection(mockSdkError);
      await expect(
        nftCollection.deployDropContractAndPrepareMetadata(mockProps),
      ).rejects.toThrow('Error deploying a drop contract : Test error');
    });
  });
});
