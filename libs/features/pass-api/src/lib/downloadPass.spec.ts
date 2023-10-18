import { getEventPassRevealedFilePath, downloadPass } from './downloadPass';
import { adminSdk } from '@gql/admin/api';
import { FileDownloader } from '@file-upload/user';
import { isServerSide } from '@utils';
import { cookies } from 'next/headers';
import { mockEventPassNft } from './revealPass.spec';

// Mocking the dependencies
jest.mock('@gql/admin/api');
jest.mock('@file-upload/user');
jest.mock('@utils');
jest.mock('next/headers');

// Mock nextAuthCookieName to always return a sample cookie name
jest.mock('@next/next-auth/common', () => ({
  ...jest.requireActual('@next/next-auth/common'),
  nextAuthCookieName: jest
    .fn()
    .mockReturnValue('__Secure-next-auth.session-token'),
}));

jest.mock('@utils', () => ({
  ...jest.requireActual('@utils'),
  isServerSide: jest.fn(),
}));

// Mock cookies function
const mockCookiesGet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: () => ({ get: mockCookiesGet }),
}));

// Mock FileDownloader
const downloadFileMock = jest.fn();
const toObjectURLMock = jest.fn();
jest.mock('@file-upload/user', () => ({
  FileDownloader: jest.fn().mockImplementation(() => {
    return { downloadFile: downloadFileMock, toObjectURL: toObjectURLMock };
  }),
}));

const mockEventPassNftRevealed = {
  ...mockEventPassNft,
  isRevealed: true,
};

describe('downloadPass functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEventPassRevealedFilePath', () => {
    it('returns correct path when all data is available', async () => {
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNftRevealed,
      });
      const result = await getEventPassRevealedFilePath('valid-id');
      // Your assertion here
      expect(result).toEqual(
        '/local/users/test-address/test-organizer/events/test-event/test-id/test-event-test-id-12421'
      );
    });

    it('throws error if event pass is not owned by user', async () => {
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: null,
      });

      await expect(getEventPassRevealedFilePath('valid-id')).rejects.toThrow(
        'Event Pass not owned by user'
      );
    });

    it('throws error if event pass is not revealed', async () => {
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNft,
      });

      await expect(getEventPassRevealedFilePath('valid-id')).rejects.toThrow(
        'Event Pass is not revealed'
      );
    });
  });

  // ... [previous imports and mocks]

  describe('downloadPass', () => {
    it("throws error when not on server side and using action 'display'", async () => {
      (isServerSide as jest.Mock).mockReturnValue(true);

      await expect(downloadPass('valid-id', 'display')).rejects.toThrow(
        'The action display can only be called on client side'
      );
    });

    it('throws error if JWT cookie is not found', async () => {
      (isServerSide as jest.Mock).mockReturnValue(true);
      mockCookiesGet.mockReturnValue(undefined); // No JWT cookie

      await expect(downloadPass('valid-id')).rejects.toThrow(
        'jwt cookie not found for user'
      );
    });

    it('calls downloadFile when on server side and JWT cookie is found', async () => {
      const mockBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)), // mock some buffer data
      };
      (isServerSide as jest.Mock).mockReturnValue(true);
      mockCookiesGet.mockReturnValue('sample-jwt-token'); // Mock JWT cookie
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNftRevealed,
      });
      downloadFileMock.mockResolvedValue(mockBlob); // Mock FileDownloader's response

      await downloadPass('valid-id');
      expect(downloadFileMock).toHaveBeenCalled();
    });

    it('calls downloadFile with display action when on client side and JWT cookie is found', async () => {
      (isServerSide as jest.Mock).mockReturnValue(false); // Mock client side
      mockCookiesGet.mockReturnValue('sample-jwt-token'); // Mock JWT cookie
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNftRevealed,
      });

      const mockBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)), // mock some buffer data
      };

      // Mock FileDownloader's response
      downloadFileMock.mockResolvedValue(mockBlob);

      // Mock toObjectURL method of FileDownloader
      const mockObjectURL = 'mockObjectURL';
      toObjectURLMock.mockReturnValue(mockObjectURL);

      const result = await downloadPass('valid-id', 'display');

      expect(downloadFileMock).toHaveBeenCalled();
      expect(result).toBe(mockObjectURL); // Ensure the return value is the mocked URL
    });

    it('propagates error from FileDownloader', async () => {
      (isServerSide as jest.Mock).mockReturnValue(true);
      mockCookiesGet.mockReturnValue('sample-jwt-token'); // Mock JWT cookie
      (adminSdk.GetEventPassNftByIdMinimal as jest.Mock).mockResolvedValue({
        eventPassNft_by_pk: mockEventPassNftRevealed,
      });
      downloadFileMock.mockRejectedValue(new Error('File download error')); // Mock error from FileDownloader

      await expect(downloadPass('valid-id')).rejects.toThrow(
        'File download error'
      );
    });

    // ... [any other tests]
  });
});
