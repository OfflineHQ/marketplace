'use client';

import { useAuthContext } from '@next/auth';
import {
  Card,
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
  id: string;
  title: string;
  slug: string;
  heroImage: {
    url: string;
  };
  eventPasses: {
    id: string;
    name: string;
    description: string;
    nftName: string;
    nftImage: { url: string };
    nftDescription: string;
    eventPassPricing?: { maxAmount: number } | undefined;
    eventPassNftContract?: { contractAddress: string } | undefined;
  }[];
};

/* eslint-disable-next-line */
interface EventCardsProps {
  events: Event[];
  organizerId: string;
}

export function EventCards(props: EventCardsProps) {
  const events = props.events;
  const organizerId = props.organizerId;
  const empty = !events?.length;
  const { safeUser, provider } = useAuthContext();

  return (
    <div>
      {empty ? (
        <p>No events for this organizer yet.</p>
      ) : safeUser && provider ? (
        <EventCard
          events={events}
          provider={provider}
          organizerId={organizerId}
        />
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
  eventPassPricing?: {
    maxAmount: number;
  };
  eventPassNftContract?: {
    contractAddress: string;
  };
};

interface EventCardProps {
  events: Event[];
  provider: ExternalProvider;
  organizerId: string;
}

type DeployFunction = (
  title: string,
  id: string,
  maxAmount: number,
  eventId: string,
  metadata: nftsMetadata
) => Promise<void>;

function renderEventPass(
  eventPass: EventPass,
  event: Event,
  deploy: DeployFunction
) {
  return (
    <Card
      className="w-full items-center justify-center md:w-[380px]"
      key={eventPass.id}
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
            <p className="text-sm font-medium leading-none">{event.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardOverlay />
      <CardFooter variant="sticky">
        {!eventPass.eventPassPricing?.maxAmount ? (
          <p>No eventPassPricing for this eventPass</p>
        ) : (
          <div>
            {!eventPass.eventPassNftContract ? (
              <Button
                className="w-full"
                onClick={async () => {
                  await deploy(
                    eventPass.name,
                    eventPass.id,
                    eventPass.eventPassPricing?.maxAmount || 0,
                    event.id,
                    {
                      name: eventPass.nftName,
                      description: eventPass.nftDescription,
                      image:
                        eventPass.nftImage === null
                          ? ''
                          : eventPass.nftImage.url,
                    }
                  );
                }}
              >
                Deploy
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={async () => {
                  navigator.clipboard.writeText(
                    eventPass.eventPassNftContract?.contractAddress || ''
                  );
                }}
              >
                Copy contract address
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function EventCard(props: EventCardProps) {
  const events = props.events;
  const provider = props.provider;
  const organizerId = props.organizerId;
  const sdk = new nftCollection(provider);
  console.log(events);

  async function deploy(
    title: string,
    id: string,
    maxAmount: number,
    eventId: string,
    metadata: nftsMetadata
  ) {
    await sdk.deployACollection(
      title,
      id,
      maxAmount,
      eventId,
      organizerId,
      metadata
    );
  }

  return (
    <div className="grid grid-cols-4 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {events.map((event: Event, idx: number) => (
        <div key={idx}>
          {event.eventPasses && event.eventPasses.length
            ? event.eventPasses.map((eventPass: EventPass) =>
                renderEventPass(eventPass, event, deploy)
              )
            : null}
        </div>
      ))}
    </div>
  );
}
