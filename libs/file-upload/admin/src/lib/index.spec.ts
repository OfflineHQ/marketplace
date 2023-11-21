import * as Upload from '@bytescale/sdk';
import retry from 'async-retry';
import {
  FileCopyStatusEnum,
  FileWrapper,
  FolderWrapper,
  JobWrapper,
  UploadWrapper,
  executeJobWithRetry,
} from './index';

let jobWrapper: JobWrapper;

jest.mock('async-retry', () => {
  return {
    __esModule: true, // this property makes it work
    default: jest.fn(async (fn, opts) => {
      let attempts = 0;
      while (attempts < opts.retries) {
        try {
          return await fn();
        } catch (error) {
          if (attempts < opts.retries - 1) {
            attempts++;
            if (opts.onRetry) {
              opts.onRetry(error);
            }
          } else {
            throw error;
          }
        }
      }
    }),
  };
});

jest.mock('@bytescale/sdk', () => ({
  UploadManager: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockResolvedValue({
      fileUrl: 'https://mock-file-url.com',
      filePath: '/mock/file/path',
    }),
  })),
  FolderApi: jest.fn().mockImplementation(() => ({
    putFolder: jest.fn().mockResolvedValue({ success: true }),
    listFolder: jest
      .fn()
      .mockResolvedValue({ items: [], isPaginationComplete: true }),
  })),
  FileApi: jest.fn().mockImplementation(() => ({
    downloadFile: jest.fn().mockResolvedValue(new Buffer('Mock file content')),
    getFileDetails: jest.fn().mockResolvedValue({
      accountId: 'mock-account-id',
      filePath: '/mock/file/path',
      fileUrl: 'https://mock-file-url.com',
      lastModified: 1615680311115,
      metadata: { myCustomField1: true },
      mime: 'image/jpeg',
      originalFileName: 'example.jpg',
      size: 43182,
      tags: ['example_tag'],
    }),
    copyFile: jest
      .fn()
      .mockResolvedValue({ status: FileCopyStatusEnum.Copied }),
    copyFileBatch: jest.fn().mockResolvedValue({ jobId: 'mock-job-id' }),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    deleteFileBatch: jest.fn().mockResolvedValue({
      jobId: 'mock-job-id',
      jobType: 'DeleteFileBatchJob',
    }),
  })),
  JobApi: jest.fn().mockImplementation(() => {
    return {
      getJob: jest.fn().mockResolvedValue({
        status: 'Completed',
      }),
      listRecentJobs: jest.fn().mockResolvedValue({
        items: [
          {
            status: 'Cancelled',
            // Add additional fields as needed for your test
          },
        ],
      }),
      cancelJob: jest.fn().mockResolvedValue(undefined),
    };
  }),

  Configuration: jest.fn(),
}));

describe('executeJobWithRetry', () => {
  beforeEach(() => {
    jobWrapper = new JobWrapper();
    retry.mockClear();
  });

  it('should not retry if the job has completed', async () => {
    const jobFunction = jest.fn().mockResolvedValue({
      jobId: 'mock-job-id',
      jobType: 'DeleteFileBatchJob',
    });
    const params = {
      accountId: 'mock-account-id',
      deleteFileBatchRequest: { files: ['file1.jpg', 'file2.jpg'] },
    };
    const jobType = 'DeleteFileBatchJob';
    (jobWrapper as any).jobApi.getJob.mockResolvedValue({
      status: 'Completed',
    });

    await executeJobWithRetry(jobFunction, params, jobType, jobWrapper);

    expect(retry).toHaveBeenCalledTimes(1);
    expect(jobFunction).toHaveBeenCalledTimes(1);
  });

  it("should wait for a running job until it's completed without calling again the method", async () => {
    const jobFunction = jest.fn().mockResolvedValue({
      jobId: 'mock-job-id',
      jobType: 'DeleteFileBatchJob',
    });
    const params = {
      accountId: 'mock-account-id',
      deleteFileBatchRequest: { files: ['file1.jpg', 'file2.jpg'] },
    };
    const jobType = 'DeleteFileBatchJob';
    (jobWrapper as any).jobApi.getJob
      .mockResolvedValueOnce({ status: 'Running' })
      .mockResolvedValueOnce({ status: 'Running' })
      .mockResolvedValueOnce({ status: 'Running' })
      .mockResolvedValueOnce({ status: 'Running' })
      .mockResolvedValueOnce({ status: 'Completed' });

    await executeJobWithRetry(jobFunction, params, jobType, jobWrapper);

    expect(jobFunction).toHaveBeenCalledTimes(1);
    // expect(retry).toHaveBeenCalledTimes(2);
  });

  it('should restart a job if it fails', async () => {
    const jobFunction = jest.fn().mockResolvedValue({
      jobId: 'mock-job-id',
      jobType: 'DeleteFileBatchJob',
    });
    const params = {
      accountId: 'mock-account-id',
      deleteFileBatchRequest: { files: ['file1.jpg', 'file2.jpg'] },
    };
    const jobType = 'DeleteFileBatchJob';
    (jobWrapper as any).jobApi.getJob
      .mockResolvedValueOnce({ status: 'Failed' })
      .mockResolvedValueOnce({ status: 'Completed' });

    await executeJobWithRetry(jobFunction, params, jobType, jobWrapper);

    expect(jobFunction).toHaveBeenCalledTimes(2);
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the job does not finish correctly after all attempts', async () => {
    const jobFunction = jest.fn().mockResolvedValue({
      jobId: 'mock-job-id',
      jobType: 'DeleteFileBatchJob',
    });
    const params = {
      accountId: 'mock-account-id',
      deleteFileBatchRequest: { files: ['file1.jpg', 'file2.jpg'] },
    };
    const jobType = 'DeleteFileBatchJob';
    (jobWrapper as any).jobApi.getJob.mockResolvedValue({ status: 'Running' });

    await expect(
      executeJobWithRetry(jobFunction, params, jobType, jobWrapper),
    ).rejects.toThrow('Job did not finish correctly after retries');

    expect(jobFunction).toHaveBeenCalledTimes(1); // called once initially, then retried 5 times
    expect(retry).toHaveBeenCalledTimes(1); // still called once, as it wraps the retries
  });
});

describe('UploadWrapper', () => {
  let uploadWrapper: UploadWrapper;

  beforeEach(() => {
    process.env.UPLOAD_SECRET_API_KEY = 'mock-api-key';
    uploadWrapper = new UploadWrapper();
    jobWrapper = new JobWrapper();
  });

  it('should upload a file and return its URL and path', async () => {
    const mockUploadOptions = {
      data: 'Mock data',
      //... other fields
    };

    const { fileUrl, filePath } =
      await uploadWrapper.uploadFile(mockUploadOptions);

    expect(fileUrl).toEqual('https://mock-file-url.com');
    expect(filePath).toEqual('/mock/file/path');
  });
});

describe('FileWrapper', () => {
  let fileWrapper: FileWrapper;
  let mockJobApi: Upload.JobApi;
  let mockJobWrapper: JobWrapper;

  beforeEach(() => {
    process.env.UPLOAD_SECRET_API_KEY = 'mock-api-key';
    mockJobApi = new Upload.JobApi({
      apiKey: process.env.UPLOAD_SECRET_API_KEY,
    });
    mockJobWrapper = new JobWrapper(mockJobApi);
    fileWrapper = new FileWrapper(undefined, mockJobWrapper);
  });

  it('should download a file and return its content as a buffer', async () => {
    const mockDownloadFileOptions: Upload.DownloadFileParams = {
      accountId: 'mock-account-id',
      filePath: '/mock/file/path',
      cache: true,
      cacheTtl: 31536000,
      version: '1',
    };

    const result: Upload.BinaryResult = await fileWrapper.downloadFile(
      mockDownloadFileOptions,
    );

    expect(result.toString()).toEqual('Mock file content');
  });

  it('should get the details of a file', async () => {
    const mockGetFileDetailsOptions: Upload.GetFileDetailsParams = {
      accountId: 'mock-account-id',
      filePath: '/mock/file/path',
    };

    const result: Upload.FileDetails = await fileWrapper.getFileDetails(
      mockGetFileDetailsOptions,
    );

    expect(result.accountId).toEqual('mock-account-id');
    expect(result.filePath).toEqual('/mock/file/path');
    expect(result.fileUrl).toEqual('https://mock-file-url.com');
    expect(result.lastModified).toEqual(1615680311115);
    expect(result.metadata).toEqual({ myCustomField1: true });
    expect(result.mime).toEqual('image/jpeg');
    expect(result.originalFileName).toEqual('example.jpg');
    expect(result.size).toEqual(43182);
    expect(result.tags).toEqual(['example_tag']);
  });

  it('should copy a file', async () => {
    const mockCopyFileOptions: Upload.CopyFileOperationParams = {
      accountId: 'mock-account-id',
      copyFileRequest: {
        destination: '/mock/destination/path',
        source: '/mock/source/path',
      },
    };

    const result: Upload.CopyFileResponse =
      await fileWrapper.copyFile(mockCopyFileOptions);

    expect(result.status).toEqual(FileCopyStatusEnum.Copied);
  });

  it('should copy multiple files in a batch operation', async () => {
    const mockCopyFileBatchOptions: Upload.CopyFileBatchOperationParams = {
      accountId: 'mock-account-id',
      copyFileBatchRequest: {
        files: [
          {
            destination: '/mock/destination/path',
            source: '/mock/source/path',
          },
        ],
      },
    };

    const result: Upload.AsyncResponse = await fileWrapper.copyFileBatch(
      mockCopyFileBatchOptions,
    );

    expect(result.jobId).toEqual('mock-job-id');
  });

  it('should copy files with retry', async () => {
    const accountId = 'mock-account-id';
    const files: Upload.CopyFileRequest[] = [
      { source: 'file1.jpg', destination: 'file2.jpg' },
      { source: 'file3.jpg', destination: 'file4.jpg' },
    ];
    (mockJobApi.getJob as jest.Mock)
      .mockResolvedValueOnce({
        status: 'Running',
      })
      .mockResolvedValueOnce({
        status: 'Success',
      });
    await fileWrapper.copyFileBatchWithRetry(accountId, files);
    const copyFileBatch = (fileWrapper as any).fileApi.copyFileBatch;

    expect(copyFileBatch).toHaveBeenCalledTimes(1);
    expect(copyFileBatch).toHaveBeenCalledWith({
      accountId: accountId,
      copyFileBatchRequest: { files: files },
    });
  });

  it('deletes a file', async () => {
    const mockDeleteOptions: Upload.DeleteFileParams = {
      accountId: 'mock-account-id',
      filePath: '/mock/file/path',
    };

    await fileWrapper.deleteFile(mockDeleteOptions);
    // No assertion since deleteFile doesn't return anything
  });

  it('deletes a batch of files', async () => {
    const mockDeleteBatchOptions: Upload.DeleteFileBatchOperationParams = {
      accountId: 'mock-account-id',
      deleteFileBatchRequest: {
        files: ['/mock/file/path1', '/mock/file/path2'],
      },
    };

    const result = await fileWrapper.deleteFileBatch(mockDeleteBatchOptions);
    expect(result.jobType).toBe('DeleteFileBatchJob');
  });

  it('should delete files with retry', async () => {
    const accountId = 'mock-account-id';
    const files = ['file1.jpg', 'file2.jpg'];
    mockJobWrapper.getJob = jest
      .fn()
      .mockResolvedValueOnce({
        status: 'Running',
      })
      .mockResolvedValueOnce({
        status: 'Success',
      });

    await fileWrapper.deleteFilesBatchWithRetry(accountId, files);
    const deleteFileBatch = (fileWrapper as any).fileApi.deleteFileBatch;

    expect(deleteFileBatch).toHaveBeenCalledTimes(1);
    expect(deleteFileBatch).toHaveBeenCalledWith({
      accountId: accountId,
      deleteFileBatchRequest: { files: files },
    });
  });
});

describe('FolderWrapper', () => {
  let folderWrapper: FolderWrapper;

  beforeEach(() => {
    process.env.UPLOAD_SECRET_API_KEY = 'mock-api-key';
    folderWrapper = new FolderWrapper();
  });

  it('should create a folder and return a success message', async () => {
    const mockFolderOptions = {
      accountId: 'mock-account-id',
      putFolderRequest: {
        folderPath: '/mock/folder/path',
        // ...other fields
      },
    };

    const result = await folderWrapper.putFolder(mockFolderOptions);

    expect(result).toEqual({ success: true });
  });

  it('should list the contents of a folder', async () => {
    const mockListFolderOptions: Upload.ListFolderParams = {
      accountId: 'mock-account-id',
      folderPath: '/',
      recursive: false,
    };

    const result: Upload.ListFolderResponse = await folderWrapper.listFolder(
      mockListFolderOptions,
    );

    expect(result.items.length).toEqual(0);
    expect(result.isPaginationComplete).toEqual(true);
  });
});

describe('JobWrapper', () => {
  beforeEach(() => {
    jobWrapper = new JobWrapper();
  });

  it('gets a job', async () => {
    const mockGetJobOptions: Upload.GetJobParams = {
      accountId: 'mock-account-id',
      jobId: 'mock-job-id',
      jobType: 'CopyFileBatchJob',
    };

    const result = await jobWrapper.getJob(mockGetJobOptions);
    expect(result.status).toBe('Completed');
  });

  it('lists recent jobs', async () => {
    const mockListJobsOptions: Upload.ListRecentJobsParams = {
      accountId: 'mock-account-id',
      jobType: ['CopyFileBatchJob', 'DeleteFileBatchJob'],
    };

    const result = await jobWrapper.listRecentJobs(mockListJobsOptions);
    expect(result.items[0].status).toBe('Cancelled');
  });

  it('cancels a job', async () => {
    const mockCancelJobOptions: Upload.CancelJobParams = {
      accountId: 'mock-account-id',
      jobId: 'mock-job-id',
      jobType: 'CopyFileBatchJob',
    };

    await jobWrapper.cancelJob(mockCancelJobOptions);
    // No assertion since cancelJob doesn't return anything
  });
});
