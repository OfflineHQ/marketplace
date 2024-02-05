import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SheetHeader,
  SheetNavigation,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetTitle,
  SheetTitleSkeleton,
} from '@ui/components';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ContentSpaceStatusBadge } from '../../atoms/ContentSpaceStatusBadge/ContentSpaceStatusBadge';
import { ContentSpaceEventPassesTable } from '../../organisms/ContentSpaceEventPassesTable/ContentSpaceEventPassesTable';
import {
  ContentSpaceNftFiles,
  ContentSpaceNftFilesProps,
} from '../../organisms/ContentSpaceFiles/ContentSpaceFiles';
// import {
//   EventPassCard,
//   EventPassCardSkeleton,
//   type EventPassCardProps,
// } from '../EventPassCard/EventPassCard';
export type ContentSpaceSheetProps = Pick<
  ContentSpaceNftFilesProps,
  'contentSpace' | 'organizerId'
>;

export const ContentSpaceSheet = ({
  contentSpace,
  organizerId,
}: ContentSpaceSheetProps) => {
  const t = useTranslations('OrganizerContentSpaces.Sheet');
  const locale = useLocale();
  return (
    <>
      <SheetHeader size="full">
        <SheetTitle className="flex items-baseline space-x-2">
          <span>{contentSpace.title}</span>
          <ContentSpaceStatusBadge
            status={contentSpace.contentSpaceParameters?.status}
          />
        </SheetTitle>
      </SheetHeader>
      <SheetOverflow className="grid size-full gap-8 py-3 pb-28">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={['associated-event-passes', 'files']}
        >
          <AccordionItem value="associated-event-passes">
            <AccordionTrigger>{t('associated-event-passes')}</AccordionTrigger>
            <AccordionContent className="grid gap-4 py-4">
              <ContentSpaceEventPassesTable
                eventPasses={contentSpace.eventPasses}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="files">
            <AccordionTrigger>{t('files')}</AccordionTrigger>
            <AccordionContent className="grid gap-4 py-4">
              <ContentSpaceNftFiles
                contentSpace={contentSpace}
                organizerId={organizerId}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetOverflow>
      <SheetNavigation
        wrapper={<Link href={`/${locale}/perks/content-spaces`} />}
        size="full"
        backButtonText={t('go-back-to-content-spaces')}
      />
    </>
  );
};

export const ContentSpaceSheetSkeleton = () => {
  return (
    <>
      <SheetNavigationSkeleton size="full" />
      <SheetHeader size="full">
        <SheetTitleSkeleton />
      </SheetHeader>
      <SheetOverflow className="grid h-full gap-8 py-3 pb-28 md:grid-cols-2">
        Skeleton
      </SheetOverflow>
    </>
  );
};
