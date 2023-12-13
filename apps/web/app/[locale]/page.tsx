import { NotFound } from '@features/navigation';
import { Event, EventSkeleton } from '@features/organizer/event';
import { getEvent } from '@features/organizer/event-api';
import { getLocalizedUrls } from '@next/i18n';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

interface EventSectionProps {
  params: {
    locale: string;
  };
}

const eventSlug = 'offline-meet-the-team';
const organizerSlug = 'offline';

export async function generateMetadata({
  params,
}: EventSectionProps): Promise<Metadata> {
  const { locale } = params;
  let event: Awaited<ReturnType<typeof getEvent>>;
  try {
    event = await getEvent({ eventSlug, locale });
  } catch (error) {
    console.error(error);
    return {};
  }

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
  const localizedURLs = getLocalizedUrls('');
  return {
    title: event.title,
    description: firstParagraph.children[0].text,
    openGraph: {
      title: event.title,
      description: firstParagraph.children[0].text,
      url: localizedURLs[locale],
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
      canonical: localizedURLs.en,
      languages: localizedURLs,
    },
  };
}

export default function EventSection({ params }: EventSectionProps) {
  const { locale } = params;
  return (
    <Suspense fallback={<EventSkeleton />}>
      <EventSectionContent locale={locale} />
    </Suspense>
  );
}

interface EventSectionContentProps {
  locale: string;
}

async function EventSectionContent({ locale }: EventSectionContentProps) {
  const t = await getTranslations({ locale, namespace: 'Organizer.Event' });
  let event: Awaited<ReturnType<typeof getEvent>>;
  try {
    event = await getEvent({ eventSlug, locale });
  } catch (error) {
    console.error(error);
    return <NotFound />;
  }
  // in case the event is not found or the organizer slug is not the same as the one in the url redirect to 404
  if (!event || event.organizer?.slug !== organizerSlug) {
    return <NotFound />;
  } else
    return (
      <Event
        {...event}
        purchaseLink={{
          href: {
            pathname: `/organizer/${organizerSlug}/event/${eventSlug}/purchase`,
          },
        }}
        purchaseText={t('purchase-button-activator')}
      />
    );
}
