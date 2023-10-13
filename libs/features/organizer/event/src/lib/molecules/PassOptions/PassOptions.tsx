// PassOptions.tsx

import type { PassOption } from '@features/organizer/event-types';
import { EventDatesServer } from '@next/date';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Text,
} from '@ui/components';
import React from 'react';
import { EventLocations } from '../EventLocations/EventLocations';

interface PassOptionsProps {
  passOptions: PassOption[];
  className?: string;
}

export const PassOptions: React.FC<PassOptionsProps> = ({
  passOptions,
  className,
}) => {
  return (
    <Accordion type="multiple" className={className}>
      {passOptions.map(({ name, description, eventDateLocation }, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <Text>{name}</Text>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text variant="p">{description}</Text>
            <EventDatesServer
              eventDateLocations={[eventDateLocation]}
              detailed
            />
            <EventLocations eventDateLocations={[eventDateLocation]} detailed />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
