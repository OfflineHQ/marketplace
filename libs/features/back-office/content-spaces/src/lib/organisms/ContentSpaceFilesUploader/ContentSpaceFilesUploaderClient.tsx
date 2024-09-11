'use client';
import * as Bytescale from '@bytescale/sdk';
import {
  UploadDropzone,
  UploadDropzoneConfig,
} from '@bytescale/upload-widget-react';
import env from '@env/client';
import {
  getContentSpaceFolderPath,
  type GetContentSpaceFolderPath,
} from '@features/content-space-common';
import { useUploader } from '@next/uploader-provider';
import { DialogContentSkeleton } from '@ui/components';
import { useEffect } from 'react';

export type ContentSpaceFilesClientProps = GetContentSpaceFolderPath & {
  currentFiles: Bytescale.FileSummary[];
};

export function ContentSpaceFilesUploaderClient({
  organizerId,
  contentSpaceId,
  currentFiles,
}: ContentSpaceFilesClientProps) {
  const { sessionReady } = useUploader();
  const path = getContentSpaceFolderPath({
    organizerId,
    contentSpaceId,
  });
  const uploaderOptions: UploadDropzoneConfig = {
    apiKey: env.NEXT_PUBLIC_BYTESCALE_PUBLIC_API_KEY,
    multi: true,
    path: {
      folderPath: path,
    },
    // locale: {
    //   //TODO add translations
    // },
    mimeTypes: ['image/png'],
    // onPreUpload: (file: File) => {
    //   return new Promise<UploadWidgetOnPreUploadResult | undefined>(
    //     (resolve, reject) => {
    //       getEventPassFileCount({
    //         organizerId,
    //         eventId,
    //         eventPassId,
    //       })
    //         .then((numFiles) => {
    //           console.log('numFiles', numFiles);
    //           resolve({
    //             transformedFile: new File(
    //               [file],
    //               `${eventId}-${eventPassId}-${numFiles}.png`,
    //               {
    //                 type: file.type,
    //                 lastModified: file.lastModified,
    //               },
    //             ),
    //           });
    //         })
    //         .catch(reject);
    //     },
    //   );
    // },

    showFinishButton: false,
    showRemoveButton: false,
    editor: {
      images: {
        crop: false,
        preview: true,
      },
    },
    styles: {
      colors: {
        primary: '#377dff',
      },
    },
  };
  useEffect(() => {
    return () => {
      // call when unmounted to avoid api call to jwt and reload the file list
      Bytescale.AuthManager.endAuthSession();
      // resetEventPassNftFiles({
      //   locale,
      //   organizerId,
      //   eventId,
      //   eventPassId,
      //   eventSlug,
      // });
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return sessionReady ? (
    <UploadDropzone options={uploaderOptions} />
  ) : (
    <UploaderSkeleton />
  );
}

export function UploaderSkeleton() {
  return (
    <div className="rounded-md border border-dashed p-4">
      <DialogContentSkeleton />
    </div>
  );
}
