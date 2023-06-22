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
  className?: string;
};

export const EventDetails: React.FC<EventDetailsProps> = ({
  description: { json, references },
  className,
}) => {
  return (
    <Card variant="noBorder" className={className}>
      <CardContent>
        <RichTextField content={json} references={references} />
      </CardContent>
    </Card>
  );
};

export const EventDetailsSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Card variant="noBorder" className={className}>
      <CardContent>
        <RichTextFieldSkeleton />
      </CardContent>
    </Card>
  );
};
