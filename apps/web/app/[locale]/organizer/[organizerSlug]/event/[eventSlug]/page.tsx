import { NotFound } from '@features/navigation';
import { Event } from '@features/organizer/event';
import { getEvent } from '@features/organizer/event-api';
import type { Event as TEvent } from '@features/organizer/event-types';
import { locales } from '@next/i18n';
import { getNextAppURL } from '@shared/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

interface EventSectionProps {
  params: {
    eventSlug: string;
    organizerSlug: string;
    locale: string;
  };
}

function generateLocaleURLs(
  locales: readonly string[],
  organizerSlug: string,
  eventSlug: string,
) {
  const urls = {};

  locales.forEach((locale) => {
    urls[locale] =
      `${getNextAppURL()}/${locale}/organizer/${organizerSlug}/event/${eventSlug}`;
  });

  return urls;
}

export async function generateMetadata({
  params,
}: EventSectionProps): Promise<Metadata> {
  const { eventSlug, organizerSlug, locale } = params;

  const event = await getEvent({ eventSlug, locale });

  if (!event || event.organizer?.slug !== organizerSlug) {
    return {
      title: 'Offline',
      description:
        'We offers a user-friendly experience, removing the complexity of digital asset creation, sale, and management. ​',
    };
  }
  const firstParagraph = event.description.json.children.find(
    (child) => child.type === 'paragraph',
  );
  return {
    title: event.title,
    description: firstParagraph.children[0].text,
    openGraph: {
      title: event.title,
      description: firstParagraph.children[0].text,
      url: `${getNextAppURL()}/${locale}/organizer/${organizerSlug}/event/${eventSlug}`,
      siteName: 'Offline',
      images: [
        {
          url: event.heroImage.url,
          ...(event.heroImage.width ? { width: event.heroImage.width } : {}),
          ...(event.heroImage.height ? { height: event.heroImage.height } : {}),
          alt: event.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: [
        {
          url: event.heroImage.url,
          ...(event.heroImage.width ? { width: event.heroImage.width } : {}),
          ...(event.heroImage.height ? { height: event.heroImage.height } : {}),
          alt: event.title,
        },
      ],
      title: event.title,
      description: firstParagraph.children[0].text,
      creator: '@offline_live',
    },
    alternates: {
      canonical: `${getNextAppURL()}/${locale}/organizer/${organizerSlug}/event/${eventSlug}`,
      languages: generateLocaleURLs(locales, organizerSlug, eventSlug),
    },
  };
}

export default async function EventSection({ params }: EventSectionProps) {
  const { eventSlug, organizerSlug, locale } = params;

  const event = await getEvent({ eventSlug, locale });
  // in case the event is not found or the organizer slug is not the same as the one in the url redirect to 404
  if (!event || event.organizer?.slug !== organizerSlug) {
    return <NotFound />;
  } else
    return (
      <EventSectionContent
        event={event}
        eventSlug={eventSlug}
        organizerSlug={organizerSlug}
      />
    );
}

interface EventSectionContentProps {
  event: TEvent;
  eventSlug: string;
  organizerSlug: string;
}

function EventSectionContent({
  event,
  eventSlug,
  organizerSlug,
}: EventSectionContentProps) {
  const t = useTranslations('Organizer.Event');
  return (
    <Event
      {...event}
      purchaseLink={{
        href: {
          pathname: `/organizer/${organizerSlug}/event/${eventSlug}/purchase`,
          // query: {
          //   organizerSlug: organizerSlug,
          //   eventSlug: eventSlug,
          // },
        },
      }}
      purchaseText={t('purchase-button-activator')}
    />
  );
}
