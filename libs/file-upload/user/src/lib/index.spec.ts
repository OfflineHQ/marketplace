import { FileDownloader } from './index';

global.fetch = jest.fn();

const { Response } = jest.requireActual('node-fetch');

describe('FileDownloader', () => {
  let fileDownloader: FileDownloader;

  beforeEach(() => {
    global.window = Object.create({});
    Object.assign(global.window, { URL: { createObjectURL: jest.fn() } });
    fileDownloader = new FileDownloader('mock-account-id', 'mock-jwt');
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    delete global.window;
  });

  it('should create an object URL from a Blob', () => {
    const mockFileContent = new Blob(['Mock file content']);
    const mockObjectUrl = 'blob:mock-object-url';

    // Mock URL.createObjectURL to return a mock object URL
    global.URL.createObjectURL = jest.fn(() => mockObjectUrl);

    const objectUrl = fileDownloader.toObjectURL(mockFileContent);

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFileContent);
    expect(objectUrl).toEqual(mockObjectUrl);
  });

  it('should download a file', async () => {
    delete global.window;
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      buffer: () => Promise.resolve(Buffer.from('Mock file content')),
    });

    await fileDownloader.downloadFile(mockFilePath);

    expect(fetch).toHaveBeenCalledWith(
      'https://upcdn.io/mock-account-id/raw/mock/file/path?auth=true',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-jwt',
        },
      })
    );
  });

  it('should throw an error if the response status is not ok', async () => {
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(null, { status: 404 })
    );

    await expect(fileDownloader.downloadFile(mockFilePath)).rejects.toThrow(
      'HTTP error! status: 404'
    );
  });

  it('should download a file with cache control', async () => {
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('Mock file content', { status: 200 })
    );

    await fileDownloader.downloadFile(mockFilePath, {
      auth: true,
      cache: false,
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://upcdn.io/mock-account-id/raw/mock/file/path?auth=true&cache=false',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-jwt',
        },
      })
    );
  });

  it('should download a file with download option', async () => {
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('Mock file content', { status: 200 })
    );

    await fileDownloader.downloadFile(mockFilePath, {
      download: true,
      auth: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://upcdn.io/mock-account-id/raw/mock/file/path?auth=true&download=true',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-jwt',
        },
      })
    );
  });

  it('should download a file with version option', async () => {
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('Mock file content', { status: 200 })
    );

    await fileDownloader.downloadFile(mockFilePath, {
      version: 1,
      auth: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://upcdn.io/mock-account-id/raw/mock/file/path?auth=true&version=1',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-jwt',
        },
      })
    );
  });

  it('should download a file with cacheTTL option', async () => {
    const mockFilePath = '/mock/file/path';

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('Mock file content', { status: 200 })
    );

    await fileDownloader.downloadFile(mockFilePath, {
      cacheTTL: 3600,
      auth: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://upcdn.io/mock-account-id/raw/mock/file/path?auth=true&cache_ttl=3600',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-jwt',
        },
      })
    );
  });
});
