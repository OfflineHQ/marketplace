import {
  eventPassCheck,
  eventPassTransferQRCode,
  revealPass,
} from './revealPass'; // adjust the path if necessary
import { userSdk } from '@gql/user/api';
import { adminSdk } from '@gql/admin/api';
import { FileWrapper, FileCopyStatus } from '@file-upload/admin';

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
      },
    };

    beforeEach(() => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue(
        mockResponse
      );
    });

    it('should return the event pass for a valid id', async () => {
      const result = await eventPassCheck('valid-id');
      expect(result).toEqual(mockResponse.eventPassNft_by_pk);
    });

    it('should throw an error if the event pass is not owned by the user', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: null,
      });
      await expect(eventPassCheck('invalid-id')).rejects.toThrow(
        'Event Pass not owned by user'
      );
    });

    it('should throw an error if the event pass is already revealed', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: {
          isRevealed: true,
        },
      });
      await expect(eventPassCheck('revealed-id')).rejects.toThrow(
        'Event Pass already revealed'
      );
    });
  });

  describe('eventPassTransferQRCode', () => {
    beforeEach(() => {
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.Copied,
      });
    });

    it('should handle the file transfer correctly', async () => {
      await expect(
        eventPassTransferQRCode(mockEventPassNft)
      ).resolves.not.toThrow();
    });

    it('should throw an error if the file copy operation fails', async () => {
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: 'Failed',
      });
      await expect(eventPassTransferQRCode(mockEventPassNft)).rejects.toThrow(
        'Failed'
      );
    });
  });

  describe('revealPass', () => {
    jest.mock('@gql/user/api', () => ({
      ...jest.requireActual('@gql/user/api'),
      userSdk: {
        ...jest.requireActual('@gql/user/api').userSdk,
        GetEventPassNftById: jest.fn(),
      },
    }));

    it('should reveal the pass correctly', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.Copied,
      });
      (adminSdk.SetEventPassNftRevealed as jest.Mock).mockResolvedValue(true);
      await expect(revealPass('valid-id')).resolves.not.toThrow();
    });

    it('should propagate error from eventPassCheck', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockRejectedValue(
        new Error('Error from eventPassCheck')
      );
      await expect(revealPass('invalid-id')).rejects.toThrow(
        'Error from eventPassCheck'
      );
    });

    it('should propagate error from eventPassTransferQRCode', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockRejectedValue(
        new Error('Error from eventPassTransferQRCode')
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from eventPassTransferQRCode'
      );
    });

    it("should propagate error from eventPassTransferQRCode if file doesn't exist", async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.FileNotFound,
      });
      await expect(revealPass('valid-id')).rejects.toThrow(
        FileCopyStatus.FileNotFound
      );
    });

    it('should propagate error from SetEventPassNftRevealed', async () => {
      (userSdk.GetEventPassNftById as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.Copied,
      });
      (adminSdk.SetEventPassNftRevealed as jest.Mock).mockRejectedValue(
        new Error('Error from SetEventPassNftRevealed')
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from SetEventPassNftRevealed'
      );
    });
  });
});
