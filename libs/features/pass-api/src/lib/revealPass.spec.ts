import { FileCopyStatusEnum, FileWrapper } from '@file-upload/admin';
import { adminSdk } from '@gql/admin/api';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import {
  eventPassCheck,
  eventPassTransferQRCode,
  revealPass,
} from './revealPass'; // adjust the path if necessary

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api');
jest.mock('@gql/admin/api');
jest.mock('@file-upload/admin');

export const mockEventPassNft = {
  eventPassId: 'test-id',
  organizerId: 'test-organizer',
  eventId: 'test-event',
  currentOwnerAddress: 'test-address',
  tokenId: 12421,
  id: 'dummy',
  isRevealed: false,
  chainId: '0x01',
  contractAddress: '0xsdasfqwr1',
  eventPassNftContract: {
    type: EventPassNftContractType_Enum.Normal,
    isDelayedRevealed: false,
  },
};

describe('revealPass.ts tests', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  describe('eventPassCheck', () => {
    const mockResponse = {
      eventPassNft_by_pk: {
        isRevealed: false,
        currentOwnerAddress: 'test-address',
        eventPassNftContract: {
          type: EventPassNftContractType_Enum.Normal,
          isDelayedRevealed: false,
        },
      },
    };

    const mockResponseRevealed = {
      eventPassNft_by_pk: {
        isRevealed: true,
        currentOwnerAddress: 'test-address',
        eventPassNftContract: {
          type: EventPassNftContractType_Enum.Normal,
          isDelayedRevealed: false,
        },
      },
    };

    const mockResponseDelayedRevealRevealed = {
      eventPassNft_by_pk: {
        isRevealed: false,
        currentOwnerAddress: 'test-address',
        eventPassNftContract: {
          type: EventPassNftContractType_Enum.DelayedReveal,
          isDelayedRevealed: true,
        },
      },
    };

    const mockResponseDelayedRevealNotRevealed = {
      eventPassNft_by_pk: {
        isRevealed: false,
        currentOwnerAddress: 'test-address',
        eventPassNftContract: {
          type: EventPassNftContractType_Enum.DelayedReveal,
          isDelayedRevealed: false,
        },
      },
    };

    beforeEach(() => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue(mockResponse);
      (getCurrentUser as jest.Mock).mockResolvedValue({
        address: 'test-address',
      });
    });

    it('should return the event pass for a valid id', async () => {
      const result = await eventPassCheck('valid-id');
      expect(result).toEqual(mockResponse.eventPassNft_by_pk);
    });

    it('should return the event pass for a event pass with a contract of type delayed reveal that is already revealed', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue(mockResponseDelayedRevealRevealed);
      const result = await eventPassCheck('revealed-id');
      expect(result).toEqual(
        mockResponseDelayedRevealRevealed.eventPassNft_by_pk,
      );
    });

    it('should throw an error if the event pass is not owned by the user', async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({
        address: 'different-address',
      });
      await expect(eventPassCheck('invalid-id')).rejects.toThrow(
        'Event Pass not owned by user',
      );
    });

    it('should throw an error if the event pass is already revealed', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue(mockResponseRevealed);
      await expect(eventPassCheck('revealed-id')).rejects.toThrow(
        'Event Pass already revealed',
      );
    });
    it('should throw an error if the event pass has no contract associated', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue({
        eventPassNft_by_pk: {
          isRevealed: false,
          currentOwnerAddress: 'test-address',
        },
      });
      await expect(eventPassCheck('invalid-id')).rejects.toThrow(
        'Event Pass has no contract associated',
      );
    });
    it('should throw an error if the event pass is not ready to be revealed', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue(mockResponseDelayedRevealNotRevealed);
      await expect(eventPassCheck('invalid-id')).rejects.toThrow(
        'Event Pass is not ready to be revealed',
      );
    });
  });

  describe('eventPassTransferQRCode', () => {
    beforeEach(() => {
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatusEnum.Copied,
      });
    });

    it('should handle the file transfer correctly', async () => {
      await expect(
        eventPassTransferQRCode(mockEventPassNft),
      ).resolves.not.toThrow();
    });

    it('should throw an error if the file copy operation fails', async () => {
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: 'Failed',
      });
      await expect(eventPassTransferQRCode(mockEventPassNft)).rejects.toThrow(
        'Failed',
      );
    });
  });

  describe('revealPass', () => {
    jest.mock('@gql/user/api', () => ({
      ...jest.requireActual('@gql/user/api'),
      adminSdk: {
        ...jest.requireActual('@gql/user/api').adminSdk,
        GetEventPassNftByIdWithEventPassNftContract: jest.fn(),
      },
    }));

    it('should reveal the pass correctly', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatusEnum.Copied,
      });
      (adminSdk.SetEventPassNftRevealed as jest.Mock).mockResolvedValue(true);
      await expect(revealPass('valid-id')).resolves.not.toThrow();
    });

    it('should propagate error from eventPassCheck', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockRejectedValue(new Error('Error from eventPassCheck'));
      await expect(revealPass('invalid-id')).rejects.toThrow(
        'Error from eventPassCheck',
      );
    });

    it('should propagate error from eventPassTransferQRCode', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockRejectedValue(
        new Error('Error from eventPassTransferQRCode'),
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from eventPassTransferQRCode',
      );
    });

    it("should propagate error from eventPassTransferQRCode if file doesn't exist", async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatusEnum.FileNotFound,
      });
      await expect(revealPass('valid-id')).rejects.toThrow(
        FileCopyStatusEnum.FileNotFound,
      );
    });

    it('should propagate error from SetEventPassNftRevealed', async () => {
      (
        adminSdk.GetEventPassNftByIdWithEventPassNftContract as jest.Mock
      ).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatusEnum.Copied,
      });
      (adminSdk.SetEventPassNftRevealed as jest.Mock).mockRejectedValue(
        new Error('Error from SetEventPassNftRevealed'),
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from SetEventPassNftRevealed',
      );
    });
  });
});
