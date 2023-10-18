import type { EventCart } from '@features/cart-types';
import type { EventPassCart } from '@features/organizer/event-types';
import { formatCurrency } from '@next/currency-common';
import { useCurrency } from '@next/currency-provider';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  ButtonSkeleton,
  Separator,
  Text,
  TextSkeleton,
} from '@ui/components';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
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
  grid: 'grid max-h-full w-full grid-cols-3 md:grid-cols-6 md:gap-4',
  textContainer:
    'md:space-y-4 ml-2 text-left flex flex-col justify-start md:justify-center col-span-2 md:col-span-4',
  imageContainer:
    'relative h-20 w-20 shrink-0 overflow-hidden rounded-sm md:h-40 md:w-40 col-span-1 md:col-span-2',
  button: 'self-start',
};

const AccordionContentWrapper: React.FC<EventPassesProps> = ({
  event,
  passes,
  onDelete,
}) => {
  const t = useTranslations('Cart.List.Event');
  const format = useFormatter();
  const { rates, isLoading } = useCurrency();
  const enrichedPasses = passes.map((pass) => {
    const matchingEventPass = event.eventPasses.find(
      (eventPass) => eventPass.id === pass.id
    );

    return {
      ...pass,
      ...matchingEventPass,
    };
  });

  return (
    <AccordionContent>
      <div className="mt-3 flex flex-col">
        {enrichedPasses.map((pass, index) =>
          pass.amount ? (
            <div key={pass.id + index} className="mb-5 flex md:mb-8">
              <div
                className={`flex items-center ${layout.imageContainer} h-auto md:h-auto`}
              >
                <Text
                  variant="h5"
                  className="font-semibold"
                >{`${pass.amount} x`}</Text>
              </div>
              <div className="ml-2 flex flex-col md:ml-3">
                <Text variant="h5" className="pb-2 font-semibold">
                  {pass.name}
                </Text>
                <Text variant="small">
                  {formatCurrency(
                    format,
                    {
                      amount: pass.eventPassPricing?.priceAmount || 0,
                      currency: pass.eventPassPricing?.priceCurrency,
                    },
                    rates
                  )}
                </Text>
              </div>
            </div>
          ) : null
        )}
      </div>
      <EventPassesActions
        editText={t('edit')}
        deleteText={t('remove')}
        eventSlug={event.slug as string}
        organizerSlug={event?.organizer?.slug as string}
        onDelete={onDelete}
      />
    </AccordionContent>
  );
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
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <Image
              src={event?.heroImage?.url || '/image-placeholder.svg'}
              className={layout.image}
              fill
              style={{ objectFit: 'cover' }}
              alt={event.title}
            />
          </div>
          <div className={layout.textContainer}>
            <Text variant="h4">{event.title}</Text>
            <Badge variant="secondary">
              {t('num-pass', {
                numPass: passes.reduce((sum, pass) => sum + pass.amount, 0),
              })}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContentWrapper
        event={event}
        passes={passes}
        onDelete={onDelete}
      />
    </AccordionItem>
  );
};

export const EventPassesSkeleton: React.FC = () => {
  return (
    <div className="mx-5 flex-col">
      <div className="flex max-h-28 items-center space-x-3 py-4 md:max-h-48">
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <div
              className={`h-20 w-20 animate-pulse rounded-sm bg-muted md:h-40 md:w-40`}
            />
          </div>
          <div className={`${layout.textContainer}`}>
            <TextSkeleton variant="h4" />
            <TextSkeleton className="mt-5" />
          </div>
        </div>
        <ButtonSkeleton className="h-4 w-4 rounded-full md:h-8 md:w-8" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
