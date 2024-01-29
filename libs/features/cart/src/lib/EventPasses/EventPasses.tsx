import type { EventCart } from '@features/cart-types';
import { ConvertedCurrency } from '@next/currency';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  BadgeSkeleton,
  ButtonSkeleton,
  Separator,
  Text,
  TextSkeleton,
} from '@ui/components';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { defaultLocale, messages, type Locale } from '@next/i18n';
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
  triggerContainer: 'flex space-x-3',
  image: 'rounded-sm object-cover',
  grid: 'grid w-full grid-cols-1 md:grid-cols-6 md:gap-4',
  textContainer:
    'mt-4 space-y-2 md:space-y-4 md:ml-2 text-left flex flex-col justify-start md:justify-center col-span-1 md:col-span-4',
  imageContainer:
    'relative h-32 w-full shrink-0 overflow-hidden rounded-sm md:h-40 md:max-w-64 col-span-1 md:col-span-2',
  passesTextContainer: 'flex gap-x-2 flex-wrap gap-y-2',
  button: 'self-start',
};

const AccordionContentWrapper: React.FC<EventPassesProps> = ({
  event,
  passes,
  noActions,
  timeRemainingDeletion,
}) => {
  const t = useTranslations('Cart.List.Event');
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], ['Cart.List.Event']);
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
            <div key={index} className="mb-5 grid grid-cols-6 md:mb-8">
              <div className="col-span-2 flex items-center">
                <Text
                  variant="h5"
                  className="font-semibold"
                >{`${pass.quantity} x`}</Text>
              </div>
              <div className="col-span-4 flex flex-col justify-center">
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
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <EventPassesActions
            editText={t('edit')}
            deleteText={t('remove')}
            eventSlug={event.slug as string}
            organizerSlug={event?.organizer?.slug as string}
            passes={passes}
          />
        </NextIntlClientProvider>
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
    <AccordionItem value={event.slug}>
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
      <div className="flex items-center space-x-3 py-4">
        <div className={layout.grid}>
          <div className={layout.imageContainer}>
            <div className={`size-full animate-pulse rounded-sm bg-image`} />
          </div>
          <div className={`${layout.textContainer} mb-4 space-y-4`}>
            <TextSkeleton variant="h4" />
            <BadgeSkeleton />
          </div>
        </div>
        <ButtonSkeleton isIconOnly size="xs" />
      </div>
      <Separator orientation="horizontal" decorative={true} />
    </div>
  );
};
