import type { EventPassCart } from '@features/organizer/event/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components';
import type { EventCart } from '../types';

export interface EventPassesProps {
  event: EventCart;
  passes: EventPassCart[];
}

export const EventPasses: React.FC<EventPassesProps> = ({ event, passes }) => {
  return (
    <AccordionItem value={event.id as string}>
      <AccordionTrigger>{event.title}</AccordionTrigger>
      <AccordionContent>
        {passes.map((pass, index) => (
          <div key={index}>
            Pass: {pass.name} // example if EventPassCart has a property 'name'
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export const EventPassesSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
      <h2>Event title</h2>
      <div>Pass: Pass name</div>
    </div>
  );
};
