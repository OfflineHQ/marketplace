import { GetEventPassOrganizerFolderPath } from '@features/pass-common';

export type CheckEventPassNftFilesHashProps =
  GetEventPassOrganizerFolderPath & {
    filesPath: string[];
  };

export type DuplicatesType = Array<Array<string>>;
