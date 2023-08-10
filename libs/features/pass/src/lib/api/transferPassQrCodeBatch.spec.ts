import { transferPassQrCodeBatch } from './transferPassQrCodeBatch';
import { FileWrapper } from '@file-upload/admin';
import type { BatchTransferInput } from '@features/pass-types';
import { mockEventPassOwned } from './revealPass.spec';

jest.mock('@file-upload/admin');

describe('transferPassQrCodeBatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInput: BatchTransferInput = {
    formerOwnerAddress: '0xFormerOwner',
    eventPassOwned: mockEventPassOwned,
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

  it('should throw an error if event is not found', async () => {
    const faultyInput = {
      ...mockInput,
      eventPassOwned: {
        ...mockInput.eventPassOwned,
        eventPass: undefined,
      },
    };

    await expect(transferPassQrCodeBatch([faultyInput])).rejects.toThrow(
      'Event not found for test-id'
    );
  });

  const mockInputs: BatchTransferInput[] = [
    {
      formerOwnerAddress: '0xFormerOwner1',
      eventPassOwned: mockEventPassOwned,
    },
    {
      formerOwnerAddress: '0xFormerOwner2',
      eventPassOwned: { ...mockEventPassOwned, eventPassId: 'test-id-2' },
    },
    {
      formerOwnerAddress: '0xFormerOwner3',
      eventPassOwned: { ...mockEventPassOwned, eventPassId: 'test-id-3' },
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
          '/local/users/test-address/test-organizer/events/test-slug/test-id/test-slug-test-id-test-token',
        source:
          '/local/users/0xFormerOwner1/test-organizer/events/test-slug/test-id/test-slug-test-id-test-token',
      },
      {
        destination:
          '/local/users/test-address/test-organizer/events/test-slug/test-id-2/test-slug-test-id-2-test-token',
        source:
          '/local/users/0xFormerOwner2/test-organizer/events/test-slug/test-id-2/test-slug-test-id-2-test-token',
      },
      {
        destination:
          '/local/users/test-address/test-organizer/events/test-slug/test-id-3/test-slug-test-id-3-test-token',
        source:
          '/local/users/0xFormerOwner3/test-organizer/events/test-slug/test-id-3/test-slug-test-id-3-test-token',
      },
    ]);

    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(process.env.UPLOAD_ACCOUNT_ID as string, [
      '/local/users/0xFormerOwner1/test-organizer/events/test-slug/test-id/test-slug-test-id-test-token',
      '/local/users/0xFormerOwner2/test-organizer/events/test-slug/test-id-2/test-slug-test-id-2-test-token',
      '/local/users/0xFormerOwner3/test-organizer/events/test-slug/test-id-3/test-slug-test-id-3-test-token',
    ]);
  });

  it('should throw an error if organizer for event is not found', async () => {
    const faultyInput = {
      ...mockInput,
      eventPassOwned: {
        ...mockInput.eventPassOwned,
        eventPass: {
          event: {
            slug: 'mockEventSlug',
          },
        },
      },
    };

    await expect(transferPassQrCodeBatch([faultyInput])).rejects.toThrow(
      'Organizer for event not found for test-id'
    );
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
