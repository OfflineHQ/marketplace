import * as Upload from '@bytescale/sdk';
import env from '@env/server';
import retry from 'async-retry';

export const enum FileCopyStatusEnum {
  Copied = 'Copied',
  FileNotFound = 'FileNotFound',
  SkippedDueToCondition = 'SkippedDueToCondition',
}

export async function executeJobWithRetry(
  method: (params: any) => Promise<Upload.AsyncResponse>,
  params: any,
  jobType: Upload.AccountJobType,
  jobWrapper: JobWrapper,
) {
  // Start the job
  let job = await method(params);

  const checkJobStatus = async () => {
    console.log('Checking job status...');
    const jobStatus = await jobWrapper.getJob({
      accountId: params.accountId,
      jobId: job.jobId,
      jobType: jobType,
    });

    const runningStatuses = ['Created', 'Pending', 'Running'];
    const errorStatuses = ['Failed', 'Cancelled', 'Rollback'];

    if (runningStatuses.includes(jobStatus.status)) {
      console.warn(`Job still running with status: ${jobStatus.status}`);
      throw new Error(`Job still running with status: ${jobStatus.status}`);
    } else if (errorStatuses.includes(jobStatus.status)) {
      console.log(`Job failed with status: ${jobStatus.status}. Retrying...`);
      // Start a new job if the previous job failed
      job = await method(params);
    }
  };

  try {
    await retry(checkJobStatus, {
      retries: 10, // the number of retries
      minTimeout: 2000, // the number of milliseconds before starting the first retry
      onRetry: (error) =>
        console.log(`Retrying due to error: ${error.message}`), // called when a retry is happening
      errorFilter: (error) =>
        error.message.startsWith('Job still running') ||
        error.message.startsWith('Job failed'),
    });
  } catch (error) {
    if (error.message.startsWith('Job still running')) {
      throw new Error('Job did not finish correctly after retries');
    }
    throw error;
  }
}

export class UploadWrapper {
  private uploadManager: Upload.UploadManager;

  constructor() {
    this.uploadManager = new Upload.UploadManager({
      fetchApi: fetch,
      apiKey: env.UPLOAD_SECRET_API_KEY,
    });
  }

  async uploadFile(
    uploadOptions: Upload.UploadManagerParams,
  ): Promise<Upload.FileDetails> {
    try {
      return await this.uploadManager.upload(uploadOptions);
    } catch (error) {
      console.error(`Upload failed: ${error.message}`, error);
      throw error;
    }
  }
}

export class FileWrapper {
  private fileApi: Upload.FileApi;
  private jobWrapper: JobWrapper;

  constructor(fileApi?: Upload.FileApi, jobWrapper?: JobWrapper) {
    this.fileApi =
      fileApi ||
      new Upload.FileApi({
        fetchApi: fetch,
        apiKey: env.UPLOAD_SECRET_API_KEY,
      });
    this.jobWrapper = jobWrapper || new JobWrapper();
  }

  async downloadFile(
    downloadFileOptions: Upload.DownloadFileParams,
  ): Promise<Upload.BinaryResult> {
    try {
      return await this.fileApi.downloadFile(downloadFileOptions);
    } catch (error) {
      console.error(`File download failed: ${error.message}`, error);
      throw error;
    }
  }

  async getFileDetails(
    getFileDetailsOptions: Upload.GetFileDetailsParams,
  ): Promise<Upload.FileDetails> {
    try {
      return await this.fileApi.getFileDetails(getFileDetailsOptions);
    } catch (error) {
      console.error(`Fetching file details failed: ${error.message}`, error);
      throw error;
    }
  }

  async copyFile(
    copyFileOptions: Upload.CopyFileOperationParams,
  ): Promise<Upload.CopyFileResponse> {
    try {
      return await this.fileApi.copyFile(copyFileOptions);
    } catch (error) {
      console.error(`File copy failed: ${error.message}`, error);
      throw error;
    }
  }

  async copyFileBatch(
    copyFileBatchOptions: Upload.CopyFileBatchOperationParams,
  ): Promise<Upload.AsyncResponse> {
    try {
      return await this.fileApi.copyFileBatch(copyFileBatchOptions);
    } catch (error) {
      console.error(`Batch file copy failed: ${error.message}`, error);
      throw error;
    }
  }

  async copyFileBatchWithRetry(
    accountId: string,
    files: Upload.CopyFileRequest[],
  ) {
    const copyFileBatchRequest: Upload.CopyFileBatchRequest = { files };
    const copyFileBatchOptions: Upload.CopyFileBatchOperationParams = {
      accountId,
      copyFileBatchRequest,
    };

    await executeJobWithRetry(
      this.fileApi.copyFileBatch.bind(this.fileApi),
      copyFileBatchOptions,
      'CopyFileBatchJob',
      this.jobWrapper,
    );
  }

  async deleteFile(deleteOptions: Upload.DeleteFileParams): Promise<void> {
    try {
      await this.fileApi.deleteFile(deleteOptions);
    } catch (error) {
      console.error(`File delete failed: ${error.message}`, error);
      throw error;
    }
  }

  async deleteFileBatch(
    deleteBatchOptions: Upload.DeleteFileBatchOperationParams,
  ): Promise<Upload.AsyncResponse> {
    try {
      return await this.fileApi.deleteFileBatch(deleteBatchOptions);
    } catch (error) {
      console.error(`Batch file delete failed: ${error.message}`, error);
      throw error;
    }
  }

  async deleteFilesBatchWithRetry(accountId: string, files: string[]) {
    const deleteFileBatchRequest: Upload.DeleteFileBatchRequest = { files };
    const deleteFileBatchOptions: Upload.DeleteFileBatchOperationParams = {
      accountId,
      deleteFileBatchRequest,
    };

    await executeJobWithRetry(
      this.fileApi.deleteFileBatch.bind(this.fileApi),
      deleteFileBatchOptions,
      'DeleteFileBatchJob',
      this.jobWrapper,
    );
  }
}

export class FolderWrapper {
  private folderApi: Upload.FolderApi;

  constructor() {
    this.folderApi = new Upload.FolderApi({
      fetchApi: fetch,
      apiKey: env.UPLOAD_SECRET_API_KEY,
    });
  }

  async putFolder(
    folderOptions: Upload.PutFolderOperationParams,
  ): Promise<Upload.FolderDetails> {
    try {
      return await this.folderApi.putFolder(folderOptions);
    } catch (error) {
      console.error(`Folder creation failed: ${error.message}`, error);
      throw error;
    }
  }

  async listFolder(
    listFolderOptions: Upload.ListFolderParams,
  ): Promise<Upload.ListFolderResponse> {
    try {
      return await this.folderApi.listFolder(listFolderOptions);
    } catch (error) {
      console.error(`Folder listing failed: ${error.message}`, error);
      throw error;
    }
  }
}

export class JobWrapper {
  private jobApi: Upload.JobApi;

  constructor(jobApi?: Upload.JobApi) {
    this.jobApi =
      jobApi ||
      new Upload.JobApi({
        fetchApi: fetch,
        apiKey: env.UPLOAD_SECRET_API_KEY,
      });
  }

  async getJob(jobOptions: Upload.GetJobParams): Promise<Upload.JobSummary> {
    try {
      return await this.jobApi.getJob(jobOptions);
    } catch (error) {
      console.error(`Get job failed: ${error.message}`, error);
      throw error;
    }
  }

  async listRecentJobs(
    jobOptions: Upload.ListRecentJobsParams,
  ): Promise<Upload.ListRecentJobsResponse> {
    try {
      return await this.jobApi.listRecentJobs(jobOptions);
    } catch (error) {
      console.error(`List recent jobs failed: ${error.message}`, error);
      throw error;
    }
  }

  async cancelJob(jobOptions: Upload.CancelJobParams): Promise<void> {
    try {
      return await this.jobApi.cancelJob(jobOptions);
    } catch (error) {
      console.error(`Cancel job failed: ${error.message}`, error);
      throw error;
    }
  }
}
