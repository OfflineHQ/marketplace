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

export interface EventDetailsProps {
  detailsTitle: string;
  description: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  detailsTitle,
  description,
}) => {
  return (
    <Card variant="noBorder">
      <CardHeader>
        <CardTitle>{detailsTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text variant="p">{description}</Text>
      </CardContent>
    </Card>
  );
};

export const EventDetailsSkeleton: React.FC = () => {
  return (
    <Card variant="noBorder">
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
