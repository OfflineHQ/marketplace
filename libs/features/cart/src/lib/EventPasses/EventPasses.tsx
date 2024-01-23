import type { EventCart } from '@features/cart-types';
import { ConvertedCurrency } from '@next/currency';
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
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { EventPassTimeBeforeDeletion } from '../EventPassTimeBeforeDeletion/EventPassTimeBeforeDeletion';
import {
  EventPassesActions,
  type EventPassesActionsProps,
} from './EventPassesActions';

export interface EventPassesProps
  extends Pick<EventPassesActionsProps, 'passes'> {
  event: EventCart;
  noActions?: boolean;
  timeRemainingDeletion?: boolean;
}

const layout = {
  triggerContainer: 'flex space-x-3 max-h-28 md:max-h-48',
  image: 'rounded-sm object-cover',
  grid: 'grid max-size-full grid-cols-3 md:grid-cols-6 md:gap-4',
  textContainer:
    'space-y-2 md:space-y-4 ml-2 text-left flex flex-col justify-start md:justify-center col-span-2 md:col-span-4',
  imageContainer:
    'relative md:h-20 md:w-20 w-16 h-16 shrink-0 overflow-hidden rounded-sm md:h-40 md:w-40 col-span-1 md:col-span-2',
  button: 'self-start',
};

const AccordionContentWrapper: React.FC<EventPassesProps> = ({
  event,
  passes,
  noActions,
  timeRemainingDeletion,
}) => {
  const t = useTranslations('Cart.List.Event');
  const enrichedPasses = passes.map((pass) => {
    const matchingEventPass = event.eventPasses.find(
      (eventPass) => eventPass.id === pass.eventPassId,
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
          pass.quantity ? (
            <div key={index} className="mb-5 flex md:mb-8">
              <div
                className={`flex items-center ${layout.imageContainer} h-auto md:h-auto`}
              >
                <Text
                  variant="h5"
                  className="font-semibold"
                >{`${pass.quantity} x`}</Text>
              </div>
              <div className="relative ml-2 flex flex-col justify-center md:ml-3">
                <Text variant="h5" className="pb-2 font-semibold">
                  {pass.name}
                </Text>
                <ConvertedCurrency
                  variant="small"
                  amount={pass.passPricing?.amount || 0}
                  currency={pass.passPricing?.currency}
                />
                {timeRemainingDeletion &&
                  pass.passAmount?.timeBeforeDelete &&
                  pass.created_at && (
                    <div className="mt-3 flex pr-1">
                      <EventPassTimeBeforeDeletion
                        created_at={pass.created_at}
                        timeBeforeDelete={pass.passAmount?.timeBeforeDelete}
                      />
                    </div>
                  )}
              </div>
            </div>
          ) : null,
        )}
      </div>
      {noActions ? null : (
        <EventPassesActions
          editText={t('edit')}
          deleteText={t('remove')}
          eventSlug={event.slug as string}
          organizerSlug={event?.organizer?.slug as string}
          passes={passes}
        />
      )}
    </AccordionContent>
  );
};

export const EventPasses: React.FC<EventPassesProps> = ({
  event,
  passes,
  ...props
}) => {
  const t = useTranslations('Cart.List.Event');
  return (
    <AccordionItem value={event.slug} className="mx-5">
      <AccordionTrigger className={layout.triggerContainer}>
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <Image
              src={event?.heroImage?.url || '/image-placeholder.svg'}
              className={`${layout.image} ${event?.heroImageClasses}`}
              fill
              alt={event.title}
            />
          </div>
          <div className={layout.textContainer}>
            <Text variant="h4">{event.title}</Text>
            <Badge variant="secondary">
              {t('num-pass', {
                numPass: passes.reduce((sum, pass) => sum + pass.quantity, 0),
              })}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContentWrapper event={event} passes={passes} {...props} />
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
              className={`size-20 md:size-40 animate-pulse rounded-sm bg-image`}
            />
          </div>
          <div className={`${layout.textContainer}`}>
            <TextSkeleton variant="h4" />
            <TextSkeleton className="mt-5" />
          </div>
        </div>
        <ButtonSkeleton className="size-4 md:size-8 rounded-full" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
