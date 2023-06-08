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
import {
  EventPassesActions,
  type EventPassesActionsProps,
} from './EventPassesActions';

export interface EventPassesProps
  extends Pick<EventPassesActionsProps, 'onDelete'> {
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

export const EventPasses: React.FC<EventPassesProps> = ({
  event,
  passes,
  onDelete,
}) => {
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
          <Text variant="h4">{event.title}</Text>
          <Text>
            {t('num-pass', {
              numPass: passes.reduce((sum, pass) => sum + pass.numTickets, 0),
            })}
          </Text>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col">
          {passes.map((pass, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 px-2 py-4 md:grid-cols-6"
            >
              <div className="flex items-center">
                <Text
                  variant="h5"
                  className="font-semibold"
                >{`${pass.numTickets} x`}</Text>
              </div>
              <div>
                <Text variant="h5" className="pb-2 font-semibold">
                  {pass.name}
                </Text>
                <Text variant="small">{`$${pass.price}`}</Text>
                {/* <p className="text-sm text-gray-500">{`$${pass.price}`}</p> */}
              </div>
            </div>
          ))}
        </div>
        <EventPassesActions
          editText={t('edit')}
          deleteText={t('remove')}
          eventSlug={event.slug}
          organizerSlug={event.organizer.slug}
          onDelete={onDelete}
        />
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
          <TextSkeleton variant="h4" />
          <TextSkeleton />
        </div>
        <ButtonSkeleton className="h-4 w-4 rounded-full md:h-8 md:w-8" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
