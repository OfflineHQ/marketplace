// EventDetails.tsx

import React from 'react';
import { Card, CardContent } from '@ui/components';
import {
  RichTextField,
  RichTextFieldSkeleton,
  type RichTextFieldProps,
} from '@next/hygraph';

export type EventDetailsProps = {
  description: {
    json: RichTextFieldProps['content'];
    references?: RichTextFieldProps['references'];
  };
};

export const EventDetails: React.FC<EventDetailsProps> = ({
  description: { json, references },
}) => {
  return (
    <Card variant="noBorder">
      <CardContent>
        <RichTextField content={json} references={references} />
      </CardContent>
    </Card>
  );
};

export const EventDetailsSkeleton: React.FC = () => {
  return (
    <Card variant="noBorder">
      <CardContent>
        <RichTextFieldSkeleton />
      </CardContent>
    </Card>
  );
};
