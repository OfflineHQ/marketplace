import { useTranslations } from 'next-intl';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  Button,
  ButtonSkeleton,
  CardOverlay,
  Text,
  CardDescription,
  AspectRatio,
  CardNavBack,
} from '@ui/components';
import Image from 'next/image';
import { EventPassNft } from '@features/pass-types';
import type { User } from 'next-auth';

export interface SinglePassProps {
  eventPassNft: EventPassNft;
  user?: User;
}

const layout = {
  gridWithImage:
    'bg-overlay-background w-full grid grid-cols-1 items-center gap-8 md:grid-cols-2',
  image: 'rounded-sm',
  textContainer: 'md:space-y-4 items-start h-full flex flex-col',
  text: 'mb-4',
};

export const SinglePass: React.FC<SinglePassProps> = ({
  eventPassNft,
  user,
}) => {
  const t = useTranslations('Pass.NoUserPass');
  // getLocalCart();
  const backgroundImage = eventPassNft?.eventPass?.event?.heroImage.url || '';
  return (
    <Card variant="stickyFooter" noBorder className="w-full">
      <CardOverflow>
        <div
          style={
            {
              '--overlay-image': `url(${backgroundImage})`,
            } as React.CSSProperties
          }
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="flex-col bg-overlay-background md:max-h-[400px]"
        >
          <div className="absolute z-10 mt-3 pl-3">
            <CardNavBack
              text={'See the event page'}
              variant="secondary"
              href={{ href: '/event' }}
            />
          </div>
          <CardHeader>
            <AspectRatio
              variant="square"
              className="m-6 mt-10 md:mx-auto md:mt-12 md:max-h-[300px] md:max-w-[300px]"
            >
              <Image
                className="rounded-sm"
                src={eventPassNft?.eventPass?.nftImage.url || ''}
                fill
                style={{ objectFit: 'cover' }}
                alt={eventPassNft?.eventPass?.event?.title || ''}
              />
            </AspectRatio>
            <div className="flex flex-col space-y-4 md:hidden">
              <CardTitle>{eventPassNft.eventPass?.name}</CardTitle>{' '}
              <CardDescription>
                {eventPassNft.eventPass?.description}
              </CardDescription>
            </div>
          </CardHeader>
        </div>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <CardTitle>{eventPassNft.eventPass?.name}</CardTitle>{' '}
            <CardDescription>
              {eventPassNft.eventPass?.description}
            </CardDescription>
          </div>
        </CardContent>
      </CardOverflow>
      {/* <CardOverlay /> */}
      <CardFooter className="justify-center" variant="sticky">
        {/* Here can display if pass revealed or not */}
        {/* In case user connected and is owner of the pass, put call to action button 'Reveal Pass' or 'Download Pass'/'Add to Google/Apple Wallet' */}
      </CardFooter>
    </Card>
  );
};
