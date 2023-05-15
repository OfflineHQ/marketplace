// EventDetails.tsx

import React from 'react';
import { Text, TextSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventDetailsProps {
  description: string;
}

const layout = {
  container: 'rounded-lg p-4 shadow-lg',
  title: 'mb-2 text-xl font-bold',
  description: 'text-gray-700',
};

export const EventDetails: React.FC<EventDetailsProps> = ({ description }) => {
  const t = useTranslations('Organizer.Event.Details');
  return (
    <div className={layout.container}>
      <Text variant="h2" className={layout.title}>
        {t('title')}
      </Text>
      <Text variant="p" className={layout.description}>
        {description}
      </Text>
    </div>
  );
};

export const EventDetailsSkeleton: React.FC = () => {
  return (
    <div className={layout.container}>
      <TextSkeleton variant="h2" className={layout.title} />
      <TextSkeleton variant="p" className={layout.description} />
    </div>
  );
};
