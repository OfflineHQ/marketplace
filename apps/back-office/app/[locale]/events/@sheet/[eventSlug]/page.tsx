import { EventSheet, EventSheetSkeleton } from '@features/back-office/events';
import { getEventWithPassesOrganizer } from '@features/back-office/events-api';
import { getCurrentUser } from '@next/next-auth/user';
import { SheetContent } from '@ui/components';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EventSheetPageContentProps {
  eventSlug: string;
  locale: string;
}

async function EventSheetPageContent({
  eventSlug,
  locale,
}: EventSheetPageContentProps) {
  const user = await getCurrentUser();
  if (!user || !user?.role) return notFound();
  const event = await getEventWithPassesOrganizer({ slug: eventSlug, locale });
  if (!event) return notFound();
  return <EventSheet event={event} organizerId={user.role.organizerId} />;
}

interface EventSheetPageProps {
  params: {
    locale: string;
    eventSlug: string;
  };
}

export default function EventSheetPage({
  params: { locale, eventSlug },
}: EventSheetPageProps) {
  return (
    <SheetContent size={'full'}>
      <Suspense fallback={<EventSheetSkeleton />}>
        <EventSheetPageContent eventSlug={eventSlug} locale={locale} />
      </Suspense>
    </SheetContent>
  );
}
