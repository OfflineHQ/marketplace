import {
  AppContainer,
  AppContainerOverflow,
  AppNavLayout,
} from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import {
  Organizer,
  OrganizerLatestEvents,
} from '@features/organizer/organizer-types';
import { rtfProps, rtfWithLinkProps } from '@next/hygraph/examples';
import {
  OrganizerEventsSection,
  OrganizerEventsSectionSkeleton,
} from '../OrganizerEventsSection/OrganizerEventsSection';
import {
  OrganizerSection,
  OrganizerSectionProps,
  OrganizerSectionSkeleton,
} from '../OrganizerSection/OrganizerSection';

export const organizer = {
  name: 'Organizer name',
  slug: 'organizer-slug',
  heroImage: {
    url: 'https://picsum.photos/seed/hero/2200/800',
  },
  image: {
    url: 'https://picsum.photos/id/123/350/350',
  },
  description: {
    json: rtfProps.content,
    references: [],
  },
} satisfies Organizer;

export const organizer2 = {
  name: 'Organizer with a longer name',
  slug: 'organizer-slug-2',
  heroImage: {
    url: 'https://picsum.photos/seed/picsum/2200/800',
  },
  image: {
    url: 'https://picsum.photos/id/323/350/350',
  },
  description: {
    json: rtfWithLinkProps.content,
    references: [],
  },
  twitterHandle: 'twitterHandle',
  instagramHandle: 'instagramHandle',
  tiktokHandle: 'tiktokHandle',
  facebookHandle: 'facebookHandle',
  youtubeHandle: 'youtubeHandle',
  telegramHandle: 'telegramHandle',
  discordWidgetId: 'discordWidgetId',
} satisfies Organizer;

export const latestEvents = [
  {
    event: {
      title: 'Music Festival 2022',
      slug: 'event-slug-2',
      heroImage: {
        url: 'https://picsum.photos/seed/truc/2200/800',
      },
    },
  },
  {
    event: {
      title: 'Meet and Greet',
      slug: 'event-slug',
      heroImage: {
        url: 'https://picsum.photos/seed/event/2200/800',
      },
    },
  },
  {
    event: {
      title: 'International Music and Arts Festival 2022',
      slug: 'event-slug-3',
      heroImage: {
        url: 'https://picsum.photos/seed/event3/2200/800',
      },
    },
  },
] satisfies OrganizerLatestEvents;

export function OrganizerPageDemo(organizerPageProps: OrganizerSectionProps) {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <AppContainer>
        <AppContainerOverflow>
          <OrganizerSection {...organizerPageProps} />
          <OrganizerEventsSection
            slug={organizerPageProps.slug}
            latestEvents={[]}
          />
        </AppContainerOverflow>
      </AppContainer>
    </AppNavLayout>
  );
}

export function OrganizerPageWithEventsDemo(
  organizerPageProps: OrganizerSectionProps,
) {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <AppContainer>
        <AppContainerOverflow>
          <OrganizerSection {...organizerPageProps} />
          <OrganizerEventsSection
            slug={organizerPageProps.slug}
            latestEvents={latestEvents}
          />
        </AppContainerOverflow>
      </AppContainer>
    </AppNavLayout>
  );
}
export const OrganizerPageSkeleton = () => (
  <AppNavLayout {...WithNormalUser.args}>
    <AppContainer>
      <AppContainerOverflow>
        <OrganizerSectionSkeleton />
        <OrganizerEventsSectionSkeleton />
      </AppContainerOverflow>
    </AppContainer>
  </AppNavLayout>
);
