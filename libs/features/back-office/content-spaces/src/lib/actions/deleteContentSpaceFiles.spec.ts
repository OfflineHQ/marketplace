import env from '@env/server';
import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';
import {
  deleteContentSpaceFiles,
  DeleteContentSpaceFilesProps,
} from './deleteContentSpaceFiles';

jest.mock('@file-upload/admin');
jest.mock('next/cache');

describe('deleteContentSpaceFiles', () => {
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
    const props: DeleteContentSpaceFilesProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filesSelected: { file1: true, file2: false },
    };

    const result = await deleteContentSpaceFiles(props);

    expect(result).toEqual({
      revalidateTagKey: `${props.organizerId}-${props.contentSpaceId}-getContentSpaceFiles`,
    });

    expect(mockDeleteFilesBatchWithRetry).toHaveBeenCalledWith(
      expect.any(String), // BYTESCALE_ACCOUNT_ID
      [
        `/${env.UPLOAD_PATH_PREFIX}/organizers/testOrganizerId/content-spaces/testContentSpaceId/file1`,
      ], // filesToDelete
    );
  });
  it('should call deleteFilesBatchWithRetry with all files when all are selected', async () => {
    const props: DeleteContentSpaceFilesProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filesSelected: { file1: true, file2: true },
    };

    await deleteContentSpaceFiles(props);

    expect(mockDeleteFilesBatchWithRetry).toHaveBeenCalledWith(
      expect.any(String),
      [
        `/${env.UPLOAD_PATH_PREFIX}/organizers/testOrganizerId/content-spaces/testContentSpaceId/file1`,
        `/${env.UPLOAD_PATH_PREFIX}/organizers/testOrganizerId/content-spaces/testContentSpaceId/file2`,
      ],
    );
  });
  it('should throw an error when no files are selected', async () => {
    const props: DeleteContentSpaceFilesProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filesSelected: {},
    };

    await expect(deleteContentSpaceFiles(props)).rejects.toThrow(
      'No files to delete selected',
    );
    expect(mockDeleteFilesBatchWithRetry).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should not call deleteFilesBatchWithRetry when filesSelected only contains false', async () => {
    const props: DeleteContentSpaceFilesProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filesSelected: { file1: false, file2: false },
    };

    await expect(deleteContentSpaceFiles(props)).rejects.toThrow(
      'No files to delete selected',
    );
    expect(mockDeleteFilesBatchWithRetry).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should handle error from deleteFilesBatchWithRetry', async () => {
    const props: DeleteContentSpaceFilesProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filesSelected: { file1: true },
    };

    mockDeleteFilesBatchWithRetry.mockRejectedValueOnce(
      new Error('Test error'),
    );

    await expect(deleteContentSpaceFiles(props)).rejects.toThrow('Test error');
  });
});
