import { Link } from '@next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardOverlay,
  Text,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import {
  EventPassList,
  type EventPassListProps,
} from '../EventPassList/EventPassList';

export type CartSuccessfulProps = EventPassListProps;

export const CartSuccessful: FC<CartSuccessfulProps> = ({ allPasses }) => {
  const t = useTranslations('Cart.Successful');
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <Text
              variant="h2"
              className="text-3xl font-bold tracking-tighter text-success md:text-4xl"
            >
              {t('title')}
            </Text>
            <Text
              variant="p"
              className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              {t('description')}
            </Text>
          </CardHeader>
          <CardContent>
            <EventPassList allPasses={allPasses} noActions={true} />
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <Link href="/" legacyBehavior>
            <Button variant="secondary">{t('continue-shopping-button')}</Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
