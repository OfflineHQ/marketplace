import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';
import {
  deleteContentSpaceFile,
  DeleteContentSpaceFileProps,
} from './deleteContentSpaceFile';

jest.mock('@file-upload/admin');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

describe('deleteContentSpaceFile', () => {
  const mockDeleteFile = jest.fn();
  const mockRevalidateTag = jest.fn();
  beforeAll(() => {
    // Mock the FileWrapper instance method
    FileWrapper.prototype.deleteFile = mockDeleteFile;

    // Mock the revalidateTag function
    (revalidateTag as jest.Mock) = mockRevalidateTag;
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call deleteFile and return correct revalidateTagKey', async () => {
    const props: DeleteContentSpaceFileProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filePath:
        '/local/organizers/testOrganizerId/content-spaces/testContentSpaceId/testFile',
    };

    const result = await deleteContentSpaceFile(props);

    expect(mockDeleteFile).toHaveBeenCalledWith({
      accountId: expect.any(String), // BYTESCALE_ACCOUNT_ID
      filePath:
        '/local/organizers/testOrganizerId/content-spaces/testContentSpaceId/testFile',
    });

    expect(result).toEqual({
      revalidateTagKey: `${props.organizerId}-${props.contentSpaceId}-getContentSpaceFiles`,
    });
  });

  it('should handle error from deleteFile', async () => {
    const props: DeleteContentSpaceFileProps = {
      organizerId: 'testOrganizerId',
      contentSpaceId: 'testContentSpaceId',
      filePath:
        '/local/organizers/testOrganizerId/content-spaces/testContentSpaceId/testFile',
    };

    mockDeleteFile.mockRejectedValueOnce(new Error('Test error'));

    await expect(deleteContentSpaceFile(props)).rejects.toThrow('Test error');
  });
});
