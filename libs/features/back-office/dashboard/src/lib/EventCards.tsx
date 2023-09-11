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
  useToast,
} from '@ui/components';
import NftCollection, { type NftsMetadata } from '@nft/thirdweb';
import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import type { EventFromOrganizer as TEvent } from '@features/back-office/dashboard-types';
import { UploadDropzone } from 'react-uploader';
import { useEffect, useState } from 'react';
import {
  checkFolder,
  checkFolderLength,
  renameFolderQrCodes,
} from './renameFolderQrCodes';
import { Uploader } from 'uploader';

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY || '',
});

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

function RenderEventPass(
  eventPass: TEvent['eventPasses'][0],
  event: TEvent,
  deploy: DeployFunction,
  organizerId: string
) {
  const [filesNumber, setFilesNumber] = useState(0);
  const path = `/${process.env.NEXT_PUBLIC_UPLOAD_PATH_PREFIX}/organizers/${organizerId}/events/${event.id}/${eventPass.id}`;
  const toast = useToast();
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const status = await checkFolderLength(
        path,
        eventPass.eventPassPricing?.maxAmount || 0
      );
      setFilesNumber(status.length);
      return await checkFolder(
        path,
        event.id,
        eventPass.id,
        eventPass.eventPassPricing?.maxAmount || 0
      );
    };

    fetchData().then((result) => setShowUpload(result));
  }, [path, event.id, eventPass.id, eventPass.eventPassPricing?.maxAmount]);

  const uploaderOptions = {
    multi: true,

    path: {
      folderPath: path,
    },
    onPreUpload: async (File: File) => {
      const status = await checkFolderLength(
        path,
        eventPass.eventPassPricing?.maxAmount || 0
      );

      if (status.isEqual) {
        return { errorMessage: 'Already enough files.' };
      }
    },
    maxFileCount: eventPass.eventPassPricing?.maxAmount,
    showFinishButton: true,

    styles: {
      colors: {
        primary: '#377dff',
      },
    },
  };

  return (
    <Card
      className="w-full items-center justify-center md:w-[800px]"
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
            <p></p>
            {!showUpload ? (
              filesNumber !== eventPass.eventPassPricing.maxAmount ? (
                <>
                  {filesNumber}/{eventPass.eventPassPricing?.maxAmount}
                  <UploadDropzone
                    uploader={uploader}
                    options={uploaderOptions}
                    onUpdate={async (files) => {
                      files
                        .map((x) => {
                          console.log(x);
                          return x.fileUrl;
                        })
                        .join('\n');
                      setFilesNumber(
                        (
                          await checkFolderLength(
                            path,
                            eventPass.eventPassPricing?.maxAmount || 0
                          )
                        ).length
                      );
                    }}
                    onComplete={(files) => {
                      alert(files.map((x) => x.fileUrl).join('\n'));
                    }}
                    width="800px"
                  />
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={async () => {
                    const status = await checkFolderLength(
                      path,
                      eventPass.eventPassPricing?.maxAmount || 0
                    );
                    if (status.isEqual) {
                      const res = await renameFolderQrCodes(
                        path,
                        event.id,
                        eventPass.id,
                        eventPass.eventPassPricing?.maxAmount || 0
                      );
                      toast.toast({
                        title: 'Rename',
                        description: res,
                      });
                    } else {
                      toast.toast({
                        title: 'Rename',
                        description: `Error : ${
                          status.length
                        } files but should be ${
                          eventPass.eventPassPricing?.maxAmount || 0
                        }`,
                      });
                    }
                  }}
                >
                  Rename QR codes
                </Button>
              )
            ) : null}
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
                RenderEventPass(eventPass, event, deploy, organizerId)
              )
            : null}
        </div>
      ))}
    </div>
  );
}
