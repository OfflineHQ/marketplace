import * as authProvider from '@next/auth';
import * as uploaderProvider from '@next/uploader-provider';
import { i18nUiTablesServerMocks } from '@test-utils/ui-mocks';
import { sleep } from '@utils';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import * as deleteFile from '../../actions/deleteContentSpaceFile';
import * as getPass from '../../actions/getContentSpaceFiles';

export const contentSpaceFiles = [
  {
    filePath: '/local/path/to/file1',
    fileName: 'file1',
    fileUrl: 'https://file1',
    lastModified: 1623345600000,
    size: 100,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file2',
    fileName: 'file2',
    fileUrl: 'https://file2',
    lastModified: 1623345600001,
    size: 200,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file3',
    fileName: 'file3',
    fileUrl: 'https://file3',
    lastModified: 1623345600002,
    size: 300,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file4',
    fileName: 'file4',
    fileUrl: 'https://file4',
    lastModified: 1623345600003,
    size: 400,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file5',
    fileName: 'file5',
    fileUrl: 'https://file5',
    lastModified: 1623345600004,
    size: 500,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file6',
    fileName: 'file6',
    fileUrl: 'https://file6',
    lastModified: 1623345600005,
    size: 600,
    type: 'File',
  },
];

export function contentSpaceFilesTableMocks() {
  const mock = createMock(getPass, 'getContentSpaceFiles');
  mock.mockReturnValue(Promise.resolve(contentSpaceFiles));
  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  const mockUploader = createMock(uploaderProvider, 'useUploader');
  mockUploader.mockReturnValue({ sessionReady: true });
  const mockAuth = createMock(authProvider, 'useAuthContext');
  mockAuth.mockReturnValue({
    safeUser: {
      eoa: '0x123',
    },
  });
  const mockDeleteFile = createMock(deleteFile, 'deleteContentSpaceFile');
  mockDeleteFile.mockImplementation(async () => {
    await sleep(300);
    return Promise.resolve();
  });

  return [
    mock,
    mockIntl,
    mockUploader,
    mockAuth,
    mockDeleteFile,
    ...i18nUiTablesServerMocks(),
  ];
}
