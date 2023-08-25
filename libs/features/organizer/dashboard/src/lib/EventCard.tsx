'use client';

import { useAuthContext } from '@next/auth';
import styles from './dashboard.module.css';
import {
  Card,
  CardOverflow,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardOverlay,
  CardSkeleton,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@ui/components';
import nftCollection from '@nft/thirdweb';
import { useState } from 'react';
import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';

type Event = {
  __typename?: 'Event' | undefined;
  id: string;
  slug: string;
  title: string;
  heroImage: {
    __typename?: 'Asset' | undefined;
    url: string;
  };
  eventNftCollection?: {
    contractAddress: string;
  };
};

/* eslint-disable-next-line */
interface EventCardsProps {
  events: [Event];
}

export function EventCards(props: EventCardsProps) {
  const events = props.events;
  const empty = !events?.length;
  const { safeUser, provider } = useAuthContext();

  console.log(events);

  return (
    <div className={styles['container']}>
      {empty ? (
        <p>No events for this organizer yet.</p>
      ) : safeUser ? (
        <EventCard events={events} provider={provider} />
      ) : (
        <></>
      )}
    </div>
  );
}

interface EventCardProps {
  events: [Event];
  provider: ExternalProvider;
}

function EventCard(props: EventCardProps) {
  const events = props.events;
  const provider = props.provider;
  const sdk = new nftCollection(provider);

  async function deploy(title: string, id: string) {
    await sdk.deployACollection(title, id);
    // api
  }

  return (
    <div className="grid grid-cols-4 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {events.map((event, index) => (
        <Card
          className="w-full items-center justify-center md:w-[380px]"
          key={index}
        >
          <CardHeader>
            <Avatar size="xl">
              <AvatarImage src={event.heroImage.url} />
              <AvatarFallback>{event.slug}</AvatarFallback>
            </Avatar>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Send notifications to device.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardOverflow>
            <CardContent className="grid gap-4">
              <div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Your subscription is expiring soon!
                    </p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardOverflow>
          <CardOverlay />
          <CardFooter variant="sticky">
            {event.eventNftCollection === null ? (
              <Button
                className="w-full"
                onClick={async () => {
                  await deploy(event.title, event.id);
                  //console.log('Deploy');
                }}
              >
                Deploy
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(
                    event.eventNftCollection?.contractAddress || ''
                  );
                }}
              >
                Copy contract address
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
