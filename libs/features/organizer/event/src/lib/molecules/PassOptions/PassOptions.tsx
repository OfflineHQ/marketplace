// PassOptions.tsx

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Text,
} from '@ui/components';
import type { PassOption } from '@features/organizer/event-types';
import { EventDates } from '../EventDates/EventDates';
import { EventLocations } from '../EventLocations/EventLocations';

interface PassOptionsProps {
  passOptions: PassOption[];
}

export const PassOptions: React.FC<PassOptionsProps> = ({ passOptions }) => {
  return (
    <Accordion type="multiple">
      {passOptions.map(({ name, description, eventDateLocation }, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <Text>{name}</Text>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text variant="p">{description}</Text>
            <EventDates eventDateLocations={[eventDateLocation]} detailed />
            <EventLocations eventDateLocations={[eventDateLocation]} detailed />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
