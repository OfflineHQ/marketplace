import {
  deleteEventPassFiles,
  DeleteEventPassFilesProps,
} from './deleteEventPassFiles';
import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';

jest.mock('@file-upload/admin');
jest.mock('next/cache');

describe('deleteEventPassFiles', () => {
  const mockDeleteFilesBatchWithRetry = jest.fn();
  const mockRevalidateTag = jest.fn();
  beforeAll(() => {
    // Mock the FileWrapper instance method
    FileWrapper.prototype.deleteFilesBatchWithRetry =
      mockDeleteFilesBatchWithRetry;

    // Mock the revalidateTag function
    (revalidateTag as jest.Mock) = mockRevalidateTag;
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call deleteFilesBatchWithRetry and revalidateTag with correct arguments', async () => {
    const props: DeleteEventPassFilesProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filesSelected: { file1: true, file2: false },
    };

    await deleteEventPassFiles(props);

    expect(mockDeleteFilesBatchWithRetry).toHaveBeenCalledWith(
      expect.any(String), // UPLOAD_ACCOUNT_ID
      [
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/file1',
      ], // filesToDelete
    );

    expect(mockRevalidateTag).toHaveBeenCalledWith(
      `${props.organizerId}-${props.eventId}-${props.eventPassId}-getEventPassNftFiles`,
    );
  });
  it('should call deleteFilesBatchWithRetry with all files when all are selected', async () => {
    const props: DeleteEventPassFilesProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filesSelected: { file1: true, file2: true },
    };

    await deleteEventPassFiles(props);

    expect(mockDeleteFilesBatchWithRetry).toHaveBeenCalledWith(
      expect.any(String),
      [
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/file1',
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/file2',
      ],
    );
  });
  it('should throw an error when no files are selected', async () => {
    const props: DeleteEventPassFilesProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filesSelected: {},
    };

    await expect(deleteEventPassFiles(props)).rejects.toThrow(
      'No files to delete selected',
    );
    expect(mockDeleteFilesBatchWithRetry).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should not call deleteFilesBatchWithRetry when filesSelected only contains false', async () => {
    const props: DeleteEventPassFilesProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filesSelected: { file1: false, file2: false },
    };

    await expect(deleteEventPassFiles(props)).rejects.toThrow(
      'No files to delete selected',
    );
    expect(mockDeleteFilesBatchWithRetry).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should handle error from deleteFilesBatchWithRetry', async () => {
    const props: DeleteEventPassFilesProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filesSelected: { file1: true },
    };

    mockDeleteFilesBatchWithRetry.mockRejectedValueOnce(
      new Error('Test error'),
    );

    await expect(deleteEventPassFiles(props)).rejects.toThrow('Test error');
  });
});
