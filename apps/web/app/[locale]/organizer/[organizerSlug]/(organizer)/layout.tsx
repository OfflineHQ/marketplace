import { AppContainer, AppContainerOverflow } from '@features/app-nav';

export interface OrganizerLayoutProps {
  params: {
    organizerSlug: string;
    locale: string;
  };
  children: React.ReactNode;
  latestEvents: React.ReactNode;
}

export default async function OrganizerLayout({
  params: { organizerSlug, locale },
  children,
  latestEvents,
}: OrganizerLayoutProps) {
  //todo 404 if organizer not found
  return (
    <AppContainer>
      <AppContainerOverflow>
        {children}
        {latestEvents}
      </AppContainerOverflow>
    </AppContainer>
  );
}
