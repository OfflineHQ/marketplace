'use client';
import * as Bytescale from '@bytescale/sdk';
import { UploadWidgetOnUpdateEvent } from '@bytescale/upload-widget';
import {
  UploadDropzone,
  UploadDropzoneConfig,
} from '@bytescale/upload-widget-react';
import env from '@env/client';
import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import {
  getEventPassOrganizerFolderPath,
  type GetEventPassOrganizerFolderPath,
} from '@features/pass-common';
import { useUploader } from '@next/uploader-provider';
import { Alert, AlertTitle, DialogContentSkeleton } from '@ui/components';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { resetEventPassNftFiles } from '../../actions/resetEventPassNftFiles';

export type EventPassFilesClientProps = GetEventPassOrganizerFolderPath & {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
  maxFileCount: number;
  eventSlug: string;
  currentFiles: Bytescale.FileSummary[];
};

export function EventPassFilesUploaderClient({
  eventPass,
  eventSlug,
  organizerId,
  eventId,
  eventPassId,
  maxFileCount,
  currentFiles,
}: EventPassFilesClientProps) {
  const { sessionReady } = useUploader();
  const locale = useLocale();
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassFilesUploader',
  ); // 'OrganizerEvents.Sheet.EventPassCard.EventPassFilesUploader
  const [missingFilesNumber, setMissingFilesNumber] = useState(0);
  const path = getEventPassOrganizerFolderPath({
    organizerId,
    eventId,
    eventPassId,
  });
  const uploaderOptions: UploadDropzoneConfig = {
    apiKey: env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY,
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

    maxFileCount,
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
      resetEventPassNftFiles({
        locale,
        organizerId,
        eventId,
        eventPassId,
        eventSlug,
      });
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  async function onUpdate({
    failedFiles,
    pendingFiles,
    uploadedFiles,
  }: UploadWidgetOnUpdateEvent) {
    if (uploadedFiles.length) {
      const allCurrentFiles = [...currentFiles, ...uploadedFiles];
      if (eventPass.passAmount?.maxAmount)
        setMissingFilesNumber(
          eventPass.passAmount?.maxAmount - allCurrentFiles.length,
        );
    }
  }
  return sessionReady ? (
    <div className="flex-col space-y-2">
      {missingFilesNumber > 0 && (
        <Alert variant="info">
          <AlertTitle>
            {t.rich('missing-files', {
              missingFilesNumber,
              strong: (children) => <strong>{children}</strong>,
            })}
          </AlertTitle>
        </Alert>
      )}
      <UploadDropzone options={uploaderOptions} onUpdate={onUpdate} />
    </div>
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
