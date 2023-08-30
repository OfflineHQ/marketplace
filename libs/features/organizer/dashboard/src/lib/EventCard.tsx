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
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@ui/components';
import nftCollection, { nftsMetadata } from '@nft/thirdweb';
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
  eventPasses?: [
    {
      id: string;
      name: string;
      description: string;
      nftName: string;
      nftImage: {
        url: string;
      };
      nftDescription: string;
    }
  ];
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
      ) : safeUser && provider ? (
        <EventCard events={events} provider={provider} />
      ) : (
        <p>Provider is not ready.</p>
      )}
    </div>
  );
}

type EventPass = {
  id: string;
  name: string;
  description: string;
  nftName: string;
  nftImage: {
    url: string;
  };
  nftDescription: string;
};

interface EventCardProps {
  events: [Event];
  provider: ExternalProvider;
}

function EventCard(props: EventCardProps) {
  const events = props.events;
  const provider = props.provider;
  const sdk = new nftCollection(provider);

  async function deploy(title: string, id: string, metadata: nftsMetadata) {
    await sdk.deployACollection(title, id, metadata);
  }

  return (
    <div className="grid grid-cols-4 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {events.map((event) => (
        <div>
          {event.eventPasses && event.eventPasses.length
            ? event.eventPasses.map((eventPass: EventPass, index: number) => (
                <Card
                  className="w-full items-center justify-center md:w-[380px]"
                  key={index}
                >
                  <CardHeader>
                    <Avatar size="xl">
                      <AvatarImage src={event.heroImage.url} />
                      <AvatarFallback>{event.slug}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{eventPass.name}</CardTitle>
                    <CardDescription>{eventPass.description}</CardDescription>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {event.title}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardOverlay />
                  <CardFooter variant="sticky">
                    <Button
                      className="w-full"
                      onClick={async () => {
                        await deploy(eventPass.name, eventPass.id, {
                          name: eventPass.nftName,
                          description: eventPass.nftDescription,
                          image: eventPass.nftImage.url,
                        });
                      }}
                    >
                      Deploy
                    </Button>
                  </CardFooter>
                </Card>
              ))
            : null}
        </div>
      ))}
    </div>
  );
}
