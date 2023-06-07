import type { EventPassCart } from '@features/organizer/event/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TextSkeleton,
  Separator,
  Text,
  ButtonSkeleton,
} from '@ui/components';
import Image from 'next/image';
import type { EventCart } from '../types';
import { useTranslations } from 'next-intl';

export interface EventPassesProps {
  event: EventCart;
  passes: EventPassCart[];
}

const layout = {
  triggerContainer: 'flex space-x-3 max-h-28 md:max-h-48',
  image: 'rounded-sm',
  textContainer: 'space-y-4 text-left',
  imageContainer:
    'relative h-20 w-20 shrink-0 overflow-hidden rounded-sm md:h-40 md:w-40',
  button: 'self-start',
};

export const EventPasses: React.FC<EventPassesProps> = ({ event, passes }) => {
  const t = useTranslations('Cart.List.Event');
  return (
    <AccordionItem value={event.id as string} className="mx-5">
      <AccordionTrigger className={layout.triggerContainer}>
        <div className={layout.imageContainer}>
          <Image
            src={event.heroImage}
            className={layout.image}
            fill
            style={{ objectFit: 'cover' }}
            alt={event.title}
          />
        </div>
        <div className={layout.textContainer}>
          <Text variant="h5">{event.title}</Text>
          <Text>
            {t('num-pass', {
              numPass: passes.reduce((sum, pass) => sum + pass.numTickets, 0),
            })}
          </Text>
        </div>
      </AccordionTrigger>
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
    <div className="mx-5 flex-col">
      <div className="flex max-h-28 items-center justify-between space-x-3 py-4 md:max-h-48">
        <div
          className={`h-20 w-20 animate-pulse rounded-sm bg-muted md:h-40 md:w-40`}
        />
        <div className={`${layout.textContainer} h-max`}>
          <TextSkeleton variant="h5" />
          <TextSkeleton />
        </div>
        <ButtonSkeleton className="h-4 w-4 rounded-full md:h-8 md:w-8" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
