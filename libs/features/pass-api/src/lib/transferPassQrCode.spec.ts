import { FileCopyStatusEnum, FileWrapper } from '@file-upload/admin';
import { mockEventPassNft } from './revealPass.spec';
import { transferPassQrCode } from './transferPassQrCode'; // adjust the path accordingly

jest.mock('@file-upload/admin');

describe('transferPassQrCode', () => {
  const mockFormerOwnerAddress = 'oldAddress';
  it('should transfer QR code successfully', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatusEnum.Copied,
    });

    await transferPassQrCode(mockFormerOwnerAddress, mockEventPassNft);

    expect(FileWrapper.prototype.copyFile).toBeCalled();
    expect(FileWrapper.prototype.deleteFile).toBeCalled();
  });

  it('should throw error if file copy is unsuccessful', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatusEnum.FileNotFound,
    });
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, mockEventPassNft),
    ).rejects.toThrow(FileCopyStatusEnum.FileNotFound);
  });

  it('should throw error if file deletion is unsuccessful', async () => {
    (FileWrapper.prototype.copyFile as jest.Mock).mockResolvedValueOnce({
      status: FileCopyStatusEnum.Copied,
    });
    (FileWrapper.prototype.deleteFile as jest.Mock).mockRejectedValueOnce(
      new Error('DeleteFailed'),
    );
    await expect(
      transferPassQrCode(mockFormerOwnerAddress, mockEventPassNft),
    ).rejects.toThrow('DeleteFailed');
  });
});
