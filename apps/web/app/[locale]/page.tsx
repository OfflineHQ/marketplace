import type { Metadata } from 'next';

interface EventSectionProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: EventSectionProps): Promise<Metadata> {
  const { locale } = params;
  return {
    title: 'Offline',
    description:
      'We offers a user-friendly experience, removing the complexity of digital asset creation, sale, and management. ​',
  };
}

export default function EventSection({ params }: EventSectionProps) {
  const { locale } = params;
  return null;
  // <iframe
  //   className="z-10 size-full pb-16"
  //   title="cometh"
  //   src="https://demo.cometh.io"
  // />
  // <Suspense fallback={<EventSkeleton />}>
  //   <EventSectionContent locale={locale} />
  // </Suspense>
}
