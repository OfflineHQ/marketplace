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
import NftCollection, { type NftsMetadata } from '@nft/thirdweb';
import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import type { EventFromOrganizer as TEvent } from '@features/back-office/dashboard-types';

interface EventCardsProps {
  events: TEvent[];
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

interface EventCardProps {
  events: TEvent[];
  provider: ExternalProvider;
  organizerId: string;
}

type DeployFunction = (
  title: string,
  id: string,
  maxAmount: number,
  eventId: string,
  eventSlug: string,
  metadata: NftsMetadata
) => Promise<void>;

function renderEventPass(
  eventPass: TEvent['eventPasses'][0],
  event: TEvent,
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
                    event.slug,
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
  const sdk = new NftCollection(provider);

  async function deploy(
    title: string,
    id: string,
    maxAmount: number,
    eventId: string,
    eventSlug: string,
    metadata: NftsMetadata
  ) {
    try {
      await sdk.deployACollection(
        title,
        id,
        maxAmount,
        eventId,
        organizerId,
        eventSlug,
        metadata
      );
    } catch (error) {
      console.error('Failed to deploy collection: ', error);
    }
  }

  if (!events.length) {
    return <p>No events found.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {events.map((event: TEvent, idx: number) => (
        <div key={idx}>
          {event.eventPasses && event.eventPasses.length
            ? event.eventPasses.map((eventPass) =>
                renderEventPass(eventPass, event, deploy)
              )
            : null}
        </div>
      ))}
    </div>
  );
}
