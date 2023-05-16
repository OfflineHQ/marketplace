// EventDetails.tsx

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitleSkeleton,
  CardTitle,
  Text,
  TextSkeleton,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventDetailsProps {
  description: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ description }) => {
  const t = useTranslations('Organizer.Event.Details');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text variant="p">{description}</Text>
      </CardContent>
    </Card>
  );
};

export const EventDetailsSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <CardTitleSkeleton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TextSkeleton variant="p" />
      </CardContent>
    </Card>
  );
};
