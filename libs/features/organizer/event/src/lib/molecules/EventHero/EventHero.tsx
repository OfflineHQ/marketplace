import React from 'react';
import {
  AspectRatio,
  Text,
  Button,
  AspectRatioSkeleton,
  TextSkeleton,
  ButtonSkeleton,
} from '@ui/components';
import Image from 'next/image';
import { Organizer } from '../../types';

export interface EventHeroProps {
  heroImage: string;
  title: string;
  date: string;
  location: string;
  buyFunction: () => void;
  organizer: Organizer;
  buyText: string;
}

const layout = {
  grid: 'grid grid-cols-1 items-center gap-8 md:grid-cols-2',
  image: 'rounded-sm',
  textContainer: 'space-y-2',
  text: 'mb-4',
  button: 'self-start',
};

export const EventHero: React.FC<EventHeroProps> = ({
  heroImage,
  title,
  organizer,
  date,
  location,
  buyFunction,
  buyText,
}) => {
  return (
    <div className={layout.grid}>
      <AspectRatio variant="widescreen">
        <Image
          src={heroImage}
          fill
          className={layout.image}
          style={{ objectFit: 'cover' }}
          alt={title}
        />
      </AspectRatio>
      <div className={layout.textContainer}>
        <Text variant="h1" className={layout.text}>
          {title}
        </Text>
        <Text variant="h4" className={`${layout.text} flex`}>
          <div className="font-medium">By</div>
          <div className="ml-1 tracking-wider">{organizer.name}</div>
        </Text>
        <Text variant="h3" className={layout.text}>
          {date}
        </Text>
        <Text variant="p" className={layout.text}>
          {location}
        </Text>
        <Button
          onClick={buyFunction}
          variant="default"
          className={layout.button}
        >
          {buyText}
        </Button>
      </div>
    </div>
  );
};

export const EventHeroSkeleton: React.FC = () => {
  return (
    <div className={layout.grid}>
      <AspectRatioSkeleton variant="widescreen" className={`${layout.image}`} />
      <div className="space-y-4">
        <TextSkeleton variant="h1" />
        <TextSkeleton variant="h3" />
        <TextSkeleton variant="p" />
        <ButtonSkeleton size="default" />
      </div>
    </div>
  );
};
