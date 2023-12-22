import { FileWrapper } from '@file-upload/admin';
import crypto from 'crypto';
import { unstable_cache } from 'next/cache';
import { checkEventPassNftFilesHash } from './checkEventPassFilesHash';

jest.mock('@file-upload/admin');
jest.mock('crypto');
jest.mock('next/cache');

describe('checkEventPassNftFilesHash', () => {
  beforeAll(() => {
    (unstable_cache as jest.Mock).mockImplementation(
      (fn) =>
        (...args) =>
          fn(...args),
    );
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockBlob = new Blob(['file content']);
    mockBlob.arrayBuffer = jest.fn().mockResolvedValue(mockArrayBuffer); // Mock arrayBuffer method

    const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };

    FileWrapper.prototype.downloadFile = jest
      .fn()
      .mockResolvedValue(mockResponse);
  });
  it('should return duplicate file paths', async () => {
    const mockFilesPath = ['path1', 'path2'];
    const mockProps = {
      organizerId: 'org1',
      eventId: 'event1',
      eventPassId: 'pass1',
      filesPath: mockFilesPath,
    };
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('hash1'),
    });

    const result = await checkEventPassNftFilesHash(mockProps);

    expect(result).toEqual([mockFilesPath]);
  });
  it('should return empty array when no duplicate file paths', async () => {
    const mockFilesPath = ['path1', 'path2'];
    const mockProps = {
      organizerId: 'org1',
      eventId: 'event1',
      eventPassId: 'pass1',
      filesPath: mockFilesPath,
    };

    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest
        .fn()
        .mockReturnValueOnce('hash1')
        .mockReturnValueOnce('hash2'),
    });

    const result = await checkEventPassNftFilesHash(mockProps);

    expect(result).toEqual([]);
  });

  it('should return duplicate separate entries for each files that have paths that have the same hash', async () => {
    const mockFilesPath = [
      'path1',
      'path2',
      'path3',
      'path4',
      'path5',
      'path6',
    ];
    const mockProps = {
      organizerId: 'org1',
      eventId: 'event1',
      eventPassId: 'pass1',
      filesPath: mockFilesPath,
    };

    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest
        .fn()
        .mockReturnValueOnce('hash1')
        .mockReturnValueOnce('hash2')
        .mockReturnValueOnce('hash1')
        .mockReturnValueOnce('hash1')
        .mockReturnValueOnce('hash2')
        .mockReturnValueOnce('hash3'),
    });

    const result = await checkEventPassNftFilesHash(mockProps);

    expect(result).toEqual([
      ['path1', 'path3', 'path4'],
      ['path2', 'path5'],
    ]);
  });
});
