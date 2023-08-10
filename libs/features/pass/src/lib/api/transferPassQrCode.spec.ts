import { transferPassQrCode } from './transferPassQrCode'; // adjust the path accordingly
import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import { mockEventPassOwned } from './revealPass.spec';

jest.mock('@file-upload/admin');

describe('transferPassQrCode', () => {
  const mockFormerOwnerAddress = 'oldAddress';
  it('should transfer QR code successfully', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatus.Copied,
    });

    await transferPassQrCode(mockFormerOwnerAddress, mockEventPassOwned);

    expect(FileWrapper.prototype.copyFile).toBeCalled();
    expect(FileWrapper.prototype.deleteFile).toBeCalled();
  });

  it('should throw error if event is not found', async () => {
    const invalidEventPass = { ...mockEventPassOwned, eventPass: null };
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, invalidEventPass)
    ).rejects.toThrow('Event not found');
  });

  it('should throw error if organizer for event is not found', async () => {
    const invalidEventPass = {
      ...mockEventPassOwned,
      eventPass: {
        event: {
          slug: 'test-slug',
          organizer: null,
        },
      },
    };
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, invalidEventPass)
    ).rejects.toThrow('Organizer for event not found');
  });

  it('should throw error if file copy is unsuccessful', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatus.FileNotFound,
    });
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, mockEventPassOwned)
    ).rejects.toThrow(FileCopyStatus.FileNotFound);
  });

  it('should throw error if file deletion is unsuccessful', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatus.Copied,
    });
    (FileWrapper.prototype.deleteFile as jest.Mock).mockRejectedValueOnce(
      new Error('DeleteFailed')
    );
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, mockEventPassOwned)
    ).rejects.toThrow('DeleteFailed');
  });
});
