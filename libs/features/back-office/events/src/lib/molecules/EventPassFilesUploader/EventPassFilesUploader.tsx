import { UploaderProvider } from '@next/uploader-provider';
import {
  Button,
  ButtonSkeleton,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HelperText,
} from '@ui/components';
import { Upload } from '@ui/icons';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getEventPassNftFiles } from '../../actions/getEventPassNftFiles';
import {
  EventPassFilesClientProps,
  EventPassFilesUploaderClient,
} from './EventPassFilesUploaderClient';

export interface EventPassFilesTableProps
  extends Omit<EventPassFilesClientProps, 'currentFiles' | 'maxFileCount'> {
  buttonClassName?: string;
}

export function EventPassFilesUploader(props: EventPassFilesTableProps) {
  return (
    <Suspense fallback={<ButtonSkeleton className="inline-flex" />}>
      <EventPassFilesUploaderContent {...props} />
    </Suspense>
  );
}

async function EventPassFilesUploaderContent({
  eventPass,
  buttonClassName,
  ...props
}: EventPassFilesTableProps) {
  const locale = useLocale();
  const t = await getTranslations({
    locale,
    namespace: 'OrganizerEvents.Sheet.EventPassCard.EventPassFilesUploader',
  });
  const currentFiles = await getEventPassNftFiles(props);
  const isDisabledReasons: string[] = [];
  let maxFileCount =
    (eventPass.passAmount?.maxAmount || 0) - currentFiles.length;
  if (maxFileCount < 0) maxFileCount = 0;
  if (!maxFileCount) isDisabledReasons.push(t('number-files-reached'));
  console.log('maxFileCount', maxFileCount);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          icon={<Upload />}
          className={buttonClassName}
          disabled={!maxFileCount}
        >
          {t('trigger-button')}
        </Button>
      </DialogTrigger>
      <HelperText message={isDisabledReasons} variant="info" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t.rich('description', {
              numFilesRemaining: maxFileCount,
              eventPassName: eventPass.name,
              strong: (children) => <strong>{children}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>
        <UploaderProvider>
          <EventPassFilesUploaderClient
            {...props}
            eventPass={eventPass}
            maxFileCount={maxFileCount}
            currentFiles={currentFiles}
          />
        </UploaderProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t('close-button')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
