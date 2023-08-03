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

const mockEventPassOwned = {
  eventPassId: 'test-id',
  address: 'test-address',
  tokenId: 'test-token',
  id: 'dummy',
  isRevealed: false,
  transactionHash: '0x1234567890',
  timeStamp: 213123123,
  chainId: '0x01',
  contractAddress: '0xsdasfqwr1',
  eventPass: {
    event: {
      slug: 'test-slug',
      organizer: {
        slug: 'test-organizer',
      },
    },
  },
};

describe('revealPass.ts tests', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  describe('eventPassCheck', () => {
    const mockResponse = {
      eventPassOwned_by_pk: {
        isRevealed: false,
      },
    };

    beforeEach(() => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue(
        mockResponse
      );
    });

    it('should return the event pass for a valid id', async () => {
      const result = await eventPassCheck('valid-id');
      expect(result).toEqual(mockResponse.eventPassOwned_by_pk);
    });

    it('should throw an error if the event pass is not owned by the user', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: null,
      });
      await expect(eventPassCheck('invalid-id')).rejects.toThrow(
        'Event Pass not owned by user'
      );
    });

    it('should throw an error if the event pass is already revealed', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: {
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
        eventPassTransferQRCode(mockEventPassOwned)
      ).resolves.not.toThrow();
    });

    it('should throw an error if the event is not found', async () => {
      const alteredMock = { ...mockEventPassOwned, eventPass: { event: null } };
      await expect(eventPassTransferQRCode(alteredMock)).rejects.toThrow(
        'Event not found'
      );
    });

    it('should throw an error if the organizer for the event is not found', async () => {
      const alteredMock = {
        ...mockEventPassOwned,
        eventPass: { event: { slug: 'test-slug', organizer: null } },
      };
      await expect(eventPassTransferQRCode(alteredMock)).rejects.toThrow(
        'Organizer for event not found'
      );
    });

    it('should throw an error if the file copy operation fails', async () => {
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: 'Failed',
      });
      await expect(eventPassTransferQRCode(mockEventPassOwned)).rejects.toThrow(
        'Failed'
      );
    });
  });

  describe('revealPass', () => {
    jest.mock('@gql/user/api', () => ({
      ...jest.requireActual('@gql/user/api'),
      userSdk: {
        ...jest.requireActual('@gql/user/api').userSdk,
        GetEventPassOwnedById: jest.fn(),
      },
    }));

    it('should reveal the pass correctly', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: mockEventPassOwned,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.Copied,
      });
      (adminSdk.SetEventPassOwnedRevealed as jest.Mock).mockResolvedValue(true);
      await expect(revealPass('valid-id')).resolves.not.toThrow();
    });

    it('should propagate error from eventPassCheck', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockRejectedValue(
        new Error('Error from eventPassCheck')
      );
      await expect(revealPass('invalid-id')).rejects.toThrow(
        'Error from eventPassCheck'
      );
    });

    it('should propagate error from eventPassTransferQRCode', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: mockEventPassOwned,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockRejectedValue(
        new Error('Error from eventPassTransferQRCode')
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from eventPassTransferQRCode'
      );
    });

    it("should propagate error from eventPassTransferQRCode if file doesn't exist", async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: mockEventPassOwned,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.FileNotFound,
      });
      await expect(revealPass('valid-id')).rejects.toThrow(
        FileCopyStatus.FileNotFound
      );
    });

    it('should propagate error from SetEventPassOwnedRevealed', async () => {
      (userSdk.GetEventPassOwnedById as jest.Mock).mockResolvedValue({
        eventPassOwned_by_pk: mockEventPassOwned,
      });
      (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValue({
        status: FileCopyStatus.Copied,
      });
      (adminSdk.SetEventPassOwnedRevealed as jest.Mock).mockRejectedValue(
        new Error('Error from SetEventPassOwnedRevealed')
      );
      await expect(revealPass('valid-id')).rejects.toThrow(
        'Error from SetEventPassOwnedRevealed'
      );
    });
  });
});
