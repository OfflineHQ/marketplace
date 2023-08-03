interface DownloadFileOptions {
  auth?: boolean;
  cache?: boolean;
  download?: boolean;
  version?: number;
  cacheTTL?: number;
}

export class FileDownloader {
  private readonly baseURL: string;
  private readonly accountId: string;
  private readonly jwt: string;

  constructor(accountId: string, jwt: string) {
    this.baseURL = 'https://upcdn.io';
    this.accountId = accountId;
    this.jwt = jwt;
  }

  async downloadFile(
    filePath: string,
    options: DownloadFileOptions = {
      auth: true,
    }
  ): Promise<Blob | Buffer> {
    const parameters: { [key: string]: string } = {
      ...(options.auth !== undefined
        ? { auth: options.auth ? 'true' : 'false' }
        : {}),
      ...(options.cache !== undefined
        ? { cache: options.cache ? 'true' : 'false' }
        : {}),
      ...(options.download !== undefined
        ? { download: options.download ? 'true' : 'false' }
        : {}),
      ...(options.version !== undefined
        ? { version: options.version.toString() }
        : {}),
      ...(options.cacheTTL !== undefined
        ? { cache_ttl: options.cacheTTL.toString() }
        : {}),
    };

    const params = Object.entries(parameters)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const response = await fetch(
      `${this.baseURL}/${this.accountId}/raw${filePath}?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return typeof window === 'undefined'
      ? await (response as any).buffer()
      : await response.blob();
  }

  toObjectURL(blob: Blob): string {
    if (typeof window === 'undefined') {
      throw new Error('This method can only be used in the browser');
    }
    return URL.createObjectURL(blob);
  }
}
