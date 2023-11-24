'use client';

import { UploadDropzone } from '@bytescale/upload-widget-react';
import env from '@env/client';
import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import type { EventFromOrganizer as TEvent } from '@features/back-office/events-types';
import { getEventPassOrganizerFolderPath } from '@features/pass-common';
import { useAuthContext } from '@next/auth';
import NftCollection, { type NftsMetadata } from '@nft/thirdweb-organizer';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  useToast,
} from '@ui/components';
import { useEffect, useState } from 'react';
import {
  checkFolder,
  checkFolderLength,
  renameFolderQrCodes,
} from './actions/renameFolderQrCodes';

export interface EventCardsProps {
  events: TEvent[];
  organizerId: string;
}

export function EventCards(props: EventCardsProps) {
  const { safeUser, provider } = useAuthContext();

  return safeUser && provider ? (
    <EventCard provider={provider} {...props} />
  ) : (
    <p>Provider is not ready.</p>
  );
}

interface EventCardProps extends EventCardsProps {
  provider: ExternalProvider;
}

type DeployFunction = (
  title: string,
  id: string,
  maxAmount: number,
  eventId: string,
  eventSlug: string,
  metadata: NftsMetadata,
) => Promise<void>;

interface EventPassContentProps {
  eventPass: TEvent['eventPasses'][0];
  event: TEvent;
  deploy: DeployFunction;
  organizerId: string;
}

function EventPassContent({
  organizerId,
  event,
  eventPass,
  deploy,
}: EventPassContentProps) {
  const [filesNumber, setFilesNumber] = useState(0);
  const path = getEventPassOrganizerFolderPath({
    organizerId,
    eventId: event.id,
    eventPassId: eventPass.id,
  });
  const toast = useToast();
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const status = await checkFolderLength(
        path,
        eventPass.eventPassPricing?.maxAmount || 0,
      );
      setFilesNumber(status.length);
      return await checkFolder(
        path,
        event.id,
        eventPass.id,
        eventPass.eventPassPricing?.maxAmount || 0,
      );
    };

    fetchData().then((result) => setShowUpload(result));
  }, [path, event.id, eventPass.id, eventPass.eventPassPricing?.maxAmount]);

  const uploaderOptions = {
    apiKey: env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY,
    multi: true,

    path: {
      folderPath: path,
    },
    onPreUpload: async (File: File) => {
      const status = await checkFolderLength(
        path,
        eventPass.eventPassPricing?.maxAmount || 0,
      );

      if (status.isEqual) {
        return { errorMessage: 'Already enough files.' };
      }
      if (!File.name.endsWith('.png')) {
        return { errorMessage: 'File is not a .png' };
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
    <Card className="items-center justify-center" key={eventPass.id}>
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
      <CardFooter>
        {!eventPass.eventPassPricing?.maxAmount ? (
          <p>No eventPassPricing for this eventPass</p>
        ) : (
          <div>
            {!eventPass.eventPassNftContract ? (
              <Button
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
                    },
                  );
                }}
              >
                Deploy
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  navigator.clipboard.writeText(
                    eventPass.eventPassNftContract?.contractAddress || '',
                  );
                }}
              >
                Copy contract address
              </Button>
            )}
            <p></p>
            {!showUpload && eventPass.eventPassNftContract ? (
              filesNumber !== eventPass.eventPassPricing.maxAmount ? (
                <>
                  {filesNumber}/{eventPass.eventPassPricing?.maxAmount}
                  {
                    <UploadDropzone
                      options={uploaderOptions}
                      onUpdate={async ({ uploadedFiles }) => {
                        uploadedFiles
                          .map((x) => {
                            return x.fileUrl;
                          })
                          .join('\n');
                        setFilesNumber(
                          (
                            await checkFolderLength(
                              path,
                              eventPass.eventPassPricing?.maxAmount || 0,
                            )
                          ).length,
                        );
                      }}
                      onComplete={(files) => {
                        alert(files.map((x) => x.fileUrl).join('\n'));
                      }}
                    />
                  }
                </>
              ) : (
                <Button
                  className="mt-2"
                  onClick={async () => {
                    const status = await checkFolderLength(
                      path,
                      eventPass.eventPassPricing?.maxAmount || 0,
                    );
                    if (status.isEqual) {
                      const res = await renameFolderQrCodes(
                        path,
                        event.id,
                        eventPass.id,
                        eventPass.eventPassPricing?.maxAmount || 0,
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

function EventCard({ events, provider, organizerId }: EventCardProps) {
  const sdk = new NftCollection(provider);

  async function deploy(
    title: string,
    id: string,
    maxAmount: number,
    eventId: string,
    eventSlug: string,
    metadata: NftsMetadata,
  ) {
    try {
      await sdk.deployACollection(
        title,
        id,
        maxAmount,
        eventId,
        organizerId,
        eventSlug,
        metadata,
      );
    } catch (error) {
      console.error('Failed to deploy collection: ', error);
    }
  }

  if (!events.length) {
    return <p>No events found.</p>;
  }

  return (
    <div className="m-3">
      {events.map((event: TEvent, idx: number) => (
        <div className="grid gap-8 lg:grid-cols-3" key={idx}>
          {event.eventPasses && event.eventPasses.length
            ? event.eventPasses.map((eventPass) =>
                EventPassContent({
                  eventPass,
                  event,
                  deploy,
                  organizerId,
                }),
              )
            : null}
        </div>
      ))}
    </div>
  );
}
