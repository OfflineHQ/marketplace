import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';
import {
  deleteEventPassFile,
  DeleteEventPassFileProps,
} from './deleteEventPassFile';

jest.mock('@file-upload/admin');
jest.mock('next/cache');

describe('deleteEventPassFile', () => {
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
  it('should call deleteFile and revalidateTag with correct arguments', async () => {
    const props: DeleteEventPassFileProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filePath:
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/testFile',
    };

    const result = await deleteEventPassFile(props);

    expect(result).toEqual({
      revalidateTagKey: `${props.organizerId}-${props.eventId}-${props.eventPassId}-getEventPassNftFile`,
    });

    expect(mockDeleteFile).toHaveBeenCalledWith({
      accountId: expect.any(String), // BYTESCALE_ACCOUNT_ID
      filePath:
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/testFile',
    });
  });

  it('should handle error from deleteFile', async () => {
    const props: DeleteEventPassFileProps = {
      organizerId: 'testOrganizerId',
      eventId: 'testEventId',
      eventPassId: 'testEventPassId',
      filePath:
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/testFile',
    };

    mockDeleteFile.mockRejectedValueOnce(new Error('Test error'));

    await expect(deleteEventPassFile(props)).rejects.toThrow('Test error');
  });
});
