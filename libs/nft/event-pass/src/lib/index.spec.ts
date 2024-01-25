import { transferPassQrCodeBatch } from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import { UpdateEventPassNftFromNftTransferMutation } from '@gql/admin/types';
import type { EventPassNftAfterMutation } from '@nft/types';
import { EventPassNftWrapper } from './index';

jest.mock('@features/pass-api', () => ({
  transferPassQrCodeBatch: jest.fn(),
}));

export const nftTransferWithoutMetadata = [
  {
    tokenId: '123',
    chainId: '1',
    contractAddress: '0xaddress',
    fromAddress: '0xFrom',
    toAddress: '0xTo',
    blockNumber: '1000',
    transactionHash: '0xHash',
  },
];

const nftTransfersWithoutMetadata = [
  nftTransferWithoutMetadata[0],
  {
    tokenId: '456',
    chainId: '1',
    contractAddress: '0xaddress2',
    fromAddress: '0xFrom',
    toAddress: '0xTo',
    blockNumber: '1000',
    transactionHash: '0xHash',
  },
];

export const eventPass1 = {
  eventId: 'event1',
  eventPassId: 'pass1',
  organizerId: 'org1',
};

export const eventPass2 = {
  eventId: 'event2',
  eventPassId: 'pass2',
  organizerId: 'org2',
};

const nftTransfersNotCreated = [
  {
    ...nftTransfersWithoutMetadata[0],
    ...eventPass1,
  },
  {
    ...nftTransfersWithoutMetadata[1],
    ...eventPass2,
  },
];

const eventPassNft1 = {
  ...eventPass1,
  ...nftTransferWithoutMetadata[0],
  id: 'some-uuid',
  isRevealed: false,
  currentOwnerAddress: '0xFrom',
} satisfies EventPassNftAfterMutation;

const eventPassNft2 = {
  ...eventPass2,
  ...nftTransferWithoutMetadata[1],
  id: 'some-uuid-2',
  isRevealed: true,
  currentOwnerAddress: '0xTo',
  lastNftTransfer: { fromAddress: '0xFrom' },
} satisfies EventPassNftAfterMutation;

const eventPassNfts = [eventPassNft1, eventPassNft2];

const nftTransfersCreated = nftTransfersNotCreated.map((transfer) => ({
  ...transfer,
  id: 'some-uuid',
  created_at: '2023-08-23T00:00:00Z',
}));

describe('EventPassNftWrapper', () => {
  let wrapper: EventPassNftWrapper;

  beforeEach(() => {
    wrapper = new EventPassNftWrapper();
  });

  describe('getEventPassNftTransfersMetadata', () => {
    it('should retrieve metadata for one nftTransfer', async () => {
      const mockResponse = {
        eventPassNft: [
          {
            tokenId: '123',
            ...eventPass1,
          },
        ],
      };

      adminSdk.GetEventPassNftByContractsAndTokenIds = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await wrapper.getEventPassNftTransfersMetadata(
        nftTransferWithoutMetadata,
        '1',
      );

      expect(result).toEqual([
        {
          ...nftTransferWithoutMetadata[0],
          ...eventPass1,
        },
      ]);

      expect(
        adminSdk.GetEventPassNftByContractsAndTokenIds,
      ).toHaveBeenCalledWith({
        contractAddresses: ['0xaddress'],
        chainId: '1',
        tokenIds: ['123'],
      });
    });

    it('should log an error for a contractAddress that is not in lowercase', async () => {
      // Arrange
      const uppercaseContractAddressNft = {
        ...nftTransferWithoutMetadata[0],
        contractAddress: '0xADDRESSWithUPPERCASE',
      };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await wrapper.getEventPassNftTransfersMetadata(
        [uppercaseContractAddressNft],
        '1',
      );

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Contract address 0xADDRESSWithUPPERCASE is not in lowercase',
      );

      // Restore the original console.error implementation
      consoleSpy.mockRestore();
    });

    it('should retrieve metadata for several nftTransfers', async () => {
      const mockResponse = {
        eventPassNft: [
          {
            tokenId: '123',
            ...eventPass1,
          },
          {
            tokenId: '456',
            ...eventPass2,
          },
        ],
      };

      adminSdk.GetEventPassNftByContractsAndTokenIds = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await wrapper.getEventPassNftTransfersMetadata(
        nftTransfersWithoutMetadata,
        '1',
      );

      expect(result).toEqual([
        {
          ...nftTransfersWithoutMetadata[0],
          ...eventPass1,
        },
        {
          ...nftTransfersWithoutMetadata[1],
          ...eventPass2,
        },
      ]);

      expect(
        adminSdk.GetEventPassNftByContractsAndTokenIds,
      ).toHaveBeenCalledWith({
        contractAddresses: ['0xaddress', '0xaddress2'],
        chainId: '1',
        tokenIds: ['123', '456'],
      });
    });

    it('should throw an error if GetEventPassNftByContractsAndTokenIds fails', async () => {
      adminSdk.GetEventPassNftByContractsAndTokenIds = jest
        .fn()
        .mockRejectedValue(new Error('Fetching error'));

      await expect(
        wrapper.getEventPassNftTransfersMetadata(
          nftTransfersWithoutMetadata,
          '1',
        ),
      ).rejects.toThrow('Fetching error');

      expect(
        adminSdk.GetEventPassNftByContractsAndTokenIds,
      ).toHaveBeenCalledWith({
        contractAddresses: ['0xaddress', '0xaddress2'],
        chainId: '1',
        tokenIds: ['123', '456'],
      });
    });

    it('should skip nftTransfer if it does not match with an eventPassNft and log an error', async () => {
      const mockResponse = {
        eventPassNft: [
          {
            tokenId: '123',
            ...eventPass1,
          },
          // Missing corresponding eventPassNft for tokenId '456'
        ],
      };

      adminSdk.GetEventPassNftByContractsAndTokenIds = jest
        .fn()
        .mockResolvedValue(mockResponse);

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await wrapper.getEventPassNftTransfersMetadata(
        nftTransfersWithoutMetadata,
        '1',
      );

      expect(result).toEqual([
        {
          ...nftTransfersWithoutMetadata[0],
          ...eventPass1,
        },
        // The second nftTransferWithoutMetadata is skipped
      ]);

      expect(
        adminSdk.GetEventPassNftByContractsAndTokenIds,
      ).toHaveBeenCalledWith({
        contractAddresses: ['0xaddress', '0xaddress2'],
        chainId: '1',
        tokenIds: ['123', '456'],
      });

      // Check that console.error was called
      expect(consoleSpy).toHaveBeenCalled();

      // Restore the original console.error implementation
      consoleSpy.mockRestore();
    });
  });
  describe('upsertNftTransfers', () => {
    it('should upsert several nftTransfers', async () => {
      const mockResponse = {
        insert_nftTransfer: {
          returning: nftTransfersNotCreated,
        },
      };

      adminSdk.UpsertNftTransfer = jest.fn().mockResolvedValue(mockResponse);

      const result = await wrapper.upsertNftTransfers(nftTransfersNotCreated);

      expect(result).toEqual(nftTransfersNotCreated);
      expect(adminSdk.UpsertNftTransfer).toHaveBeenCalledWith({
        objects: nftTransfersNotCreated,
      });
    });

    it('should throw an error if UpsertNftTransfer fails', async () => {
      adminSdk.UpsertNftTransfer = jest
        .fn()
        .mockRejectedValue(new Error('Upsert error'));

      await expect(
        wrapper.upsertNftTransfers(nftTransfersNotCreated),
      ).rejects.toThrow('Upsert error');
      expect(adminSdk.UpsertNftTransfer).toHaveBeenCalledWith({
        objects: nftTransfersNotCreated,
      });
    });

    it('should throw an error if insert_nftTransfer is empty', async () => {
      const mockResponse = {
        insert_nftTransfer: null,
      };

      adminSdk.UpsertNftTransfer = jest.fn().mockResolvedValue(mockResponse);

      await expect(
        wrapper.upsertNftTransfers(nftTransfersNotCreated),
      ).rejects.toThrow();
      expect(adminSdk.UpsertNftTransfer).toHaveBeenCalledWith({
        objects: nftTransfersNotCreated,
      });
    });
  });

  describe('updateEventPassNftFromNftTransfer', () => {
    it('should update eventPassNft records successfully', async () => {
      const mockResponse: UpdateEventPassNftFromNftTransferMutation = {
        update_eventPassNft_many: [
          {
            affected_rows: 1,
            returning: [eventPassNft1],
          },
          {
            affected_rows: 1,
            returning: [eventPassNft2],
          },
        ],
      };

      adminSdk.UpdateEventPassNftFromNftTransfer = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result =
        await wrapper.updateEventPassNftFromNftTransfer(nftTransfersCreated);

      expect(result).toEqual(eventPassNfts);
    });

    it('should throw an error if UpdateEventPassNftFromNftTransfer fails', async () => {
      adminSdk.UpdateEventPassNftFromNftTransfer = jest
        .fn()
        .mockRejectedValue(new Error('Update error'));

      await expect(
        wrapper.updateEventPassNftFromNftTransfer(nftTransfersCreated),
      ).rejects.toThrow('Update error');
    });

    it('should throw an error if UpdateEventPassNftFromNftTransfer returns empty', async () => {
      adminSdk.UpdateEventPassNftFromNftTransfer = jest.fn().mockResolvedValue({
        update_eventPassNft_many: null,
      });

      await expect(
        wrapper.updateEventPassNftFromNftTransfer(nftTransfersCreated),
      ).rejects.toThrow();
    });

    it('should handle empty returning and log an error', async () => {
      const mockResponse: UpdateEventPassNftFromNftTransferMutation = {
        update_eventPassNft_many: [
          {
            affected_rows: 0,
            returning: null, // Empty returning
          },
          {
            affected_rows: 1,
            returning: [eventPassNft2],
          },
        ],
      };

      adminSdk.UpdateEventPassNftFromNftTransfer = jest
        .fn()
        .mockResolvedValue(mockResponse);

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result =
        await wrapper.updateEventPassNftFromNftTransfer(nftTransfersCreated);

      expect(result.length).toBe(1); // Only one valid returning element
      expect(consoleSpy).toHaveBeenCalled();

      // Restore the original console.error implementation
      consoleSpy.mockRestore();
    });
  });

  describe('applyQrCodeBatchTransferForNewOwner', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should apply a transfer for one NFT', async () => {
      await wrapper.applyQrCodeBatchTransferForNewOwner(eventPassNfts);

      expect(transferPassQrCodeBatch).toHaveBeenCalledWith([
        {
          formerOwnerAddress: eventPassNft2.lastNftTransfer.fromAddress,
          eventPassNft: eventPassNft2,
        },
      ]);
    });

    it('should not apply a transfer if no NFT requires it', async () => {
      const mockNfts = [eventPassNft1]; // Using eventPassNft1 which doesn't require transfer

      await wrapper.applyQrCodeBatchTransferForNewOwner(mockNfts);

      expect(transferPassQrCodeBatch).not.toHaveBeenCalled();
    });

    it('should log an error for an NFT that is revealed but does not have lastNftTransfer', async () => {
      const faultyNft = {
        ...eventPassNft1,
        isRevealed: true,
        lastNftTransfer: null,
      };

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await wrapper.applyQrCodeBatchTransferForNewOwner([faultyNft]);

      expect(consoleSpy).toHaveBeenCalled();
      expect(transferPassQrCodeBatch).not.toHaveBeenCalled();

      // Restore the original console.error implementation
      consoleSpy.mockRestore();
    });
  });
});
