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

    await deleteEventPassFile(props);

    expect(mockDeleteFile).toHaveBeenCalledWith({
      accountId: expect.any(String), // UPLOAD_ACCOUNT_ID
      filePath:
        '/local/organizers/testOrganizerId/events/testEventId/testEventPassId/testFile',
    });

    expect(mockRevalidateTag).toHaveBeenCalledWith(
      `${props.organizerId}-${props.eventId}-${props.eventPassId}-getEventPassNftFile`,
    );
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
