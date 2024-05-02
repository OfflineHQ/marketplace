import { ContentSpaceFromOrganizerWithPasses } from '@features/back-office/content-spaces-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export type ContentSpaceEventPassesTableProps = Pick<
  ContentSpaceFromOrganizerWithPasses,
  'eventPasses'
>;

export function ContentSpaceEventPassesTable({
  eventPasses,
}: ContentSpaceEventPassesTableProps) {
  const eventPassesByEvent = eventPasses.reduce(
    (acc, eventPass) => {
      const event = eventPass.event;
      if (!event) return acc;
      if (!acc[event.slug]) acc[event.slug] = [];
      acc[event.slug].push(eventPass);
      return acc;
    },
    {} as Record<string, ContentSpaceFromOrganizerWithPasses['eventPasses']>,
  );

  const t = useTranslations(
    'OrganizerContentSpaces.Sheet.ContentSpaceEventPassesTable',
  );

  return (
    <>
      {Object.entries(eventPassesByEvent).map(([slug, eventPasses]) => (
        <Table key={slug}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {t('event-pass-for-event', { slug })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventPasses.map((eventPass) => (
              <TableRow key={eventPass.id}>
                <TableCell>{eventPass.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </>
  );
}

export function ContentSpaceEventPassesTableSkeleton() {
  return <TableSkeleton rows={4} cols={2} />;
}
