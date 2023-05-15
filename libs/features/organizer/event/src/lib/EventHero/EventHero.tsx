import React from 'react';
import { AspectRatio, Text, Button } from '@ui/components';
import Image from 'next/image';

export interface EventHeroProps {
  heroImage: string;
  title: string;
  date: string;
  location: string;
  buyFunction: () => void;
  buyText: string;
}

export const EventHero: React.FC<EventHeroProps> = ({
  heroImage,
  title,
  date,
  location,
  buyFunction,
  buyText,
}) => {
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <AspectRatio variant="widescreen">
        <Image
          src={heroImage}
          fill
          style={{ objectFit: 'cover' }}
          alt={title}
        />
      </AspectRatio>
      <div className="space-y-2">
        <Text variant="h1" className="mb-4">
          {title}
        </Text>
        <Text variant="h3" className="mb-4">
          {date}
        </Text>
        <Text variant="p" className="mb-4">
          {location}
        </Text>
        <Button onClick={buyFunction} variant="default" className="self-start">
          {buyText}
        </Button>
      </div>
    </div>
  );
};
