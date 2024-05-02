import { UploaderProvider } from '@next/uploader-provider';
import {
  Button,
  ButtonSkeleton,
  Dialog,
  DialogClose,
  DialogContent,
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
import { getContentSpaceFiles } from '../../actions/getContentSpaceFiles';
import {
  ContentSpaceFilesClientProps,
  ContentSpaceFilesUploaderClient,
} from './ContentSpaceFilesUploaderClient';

export interface ContentSpaceFilesTableProps
  extends Omit<ContentSpaceFilesClientProps, 'currentFiles'> {
  buttonClassName?: string;
}

export function ContentSpaceFilesUploader(props: ContentSpaceFilesTableProps) {
  return (
    <Suspense fallback={<ButtonSkeleton className="inline-flex" />}>
      <ContentSpaceFilesUploaderContent {...props} />
    </Suspense>
  );
}

async function ContentSpaceFilesUploaderContent({
  buttonClassName,
  ...props
}: ContentSpaceFilesTableProps) {
  const locale = useLocale();
  const t = await getTranslations({
    locale,
    namespace: 'OrganizerContentSpaces.Sheet.ContentSpaceFilesUploader',
  });
  const currentFiles = await getContentSpaceFiles(props);
  const isDisabledReasons: string[] = [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button icon={<Upload />} className={buttonClassName}>
          {t('trigger-button')}
        </Button>
      </DialogTrigger>
      <HelperText message={isDisabledReasons} variant="info" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <UploaderProvider>
          <ContentSpaceFilesUploaderClient
            {...props}
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
