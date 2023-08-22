import { transferPassQrCodeBatch } from './transferPassQrCodeBatch';
import { FileWrapper } from '@file-upload/admin';
import type { BatchTransferInput } from '@features/pass-types';
import { mockEventPassNft } from './revealPass.spec';

jest.mock('@file-upload/admin');

describe('transferPassQrCodeBatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInput: BatchTransferInput = {
    formerOwnerAddress: '0xFormerOwner',
    eventPassNft: mockEventPassNft,
  };

  it('should copy and delete files successfully', async () => {
    await transferPassQrCodeBatch([mockInput]);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
  });

  const mockInputs: BatchTransferInput[] = [
    {
      formerOwnerAddress: '0xFormerOwner1',
      eventPassNft: mockEventPassNft,
    },
    {
      formerOwnerAddress: '0xFormerOwner2',
      eventPassNft: { ...mockEventPassNft, eventPassId: 'test-id-2' },
    },
    {
      formerOwnerAddress: '0xFormerOwner3',
      eventPassNft: { ...mockEventPassNft, eventPassId: 'test-id-3' },
    },
  ];

  it('should copy and delete multiple files successfully', async () => {
    await transferPassQrCodeBatch(mockInputs);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(process.env.UPLOAD_ACCOUNT_ID as string, [
      {
        destination:
          '/local/users/test-address/test-organizer/events/test-event/test-id/test-event-test-id-12421',
        source:
          '/local/users/0xFormerOwner1/test-organizer/events/test-event/test-id/test-event-test-id-12421',
      },
      {
        destination:
          '/local/users/test-address/test-organizer/events/test-event/test-id-2/test-event-test-id-2-12421',
        source:
          '/local/users/0xFormerOwner2/test-organizer/events/test-event/test-id-2/test-event-test-id-2-12421',
      },
      {
        destination:
          '/local/users/test-address/test-organizer/events/test-event/test-id-3/test-event-test-id-3-12421',
        source:
          '/local/users/0xFormerOwner3/test-organizer/events/test-event/test-id-3/test-event-test-id-3-12421',
      },
    ]);

    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(process.env.UPLOAD_ACCOUNT_ID as string, [
      '/local/users/0xFormerOwner1/test-organizer/events/test-event/test-id/test-event-test-id-12421',
      '/local/users/0xFormerOwner2/test-organizer/events/test-event/test-id-2/test-event-test-id-2-12421',
      '/local/users/0xFormerOwner3/test-organizer/events/test-event/test-id-3/test-event-test-id-3-12421',
    ]);
  });

  it('should throw an error if copying files fails', async () => {
    (
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).mockRejectedValueOnce(new Error('Copy Error'));

    await expect(transferPassQrCodeBatch([mockInput])).rejects.toThrow(
      'Error while copying files in transferPassQrCodeBatch: Copy Error.'
    );
  });

  it('should throw an error if deleting files fails', async () => {
    (
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).mockRejectedValueOnce(new Error('Delete Error'));

    await expect(transferPassQrCodeBatch([mockInput])).rejects.toThrow(
      'Error while deleting files in transferPassQrCodeBatch: Delete Error.'
    );
  });
});
