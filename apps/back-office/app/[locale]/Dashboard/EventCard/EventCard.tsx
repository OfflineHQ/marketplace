import { getEventsFromOrganizerId } from '@features/organizer/event/server';
import { defaultLocale } from '@next/i18n';
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
import { getCurrentUser } from '@web/lib/session';

interface EventCard {
  __typename?: 'Event' | undefined;
  id: string;
  slug: string;
  title: string;
  heroImage: {
    __typename?: 'Asset' | undefined;
    url: string;
  };
}

export default async function EventSection() {
  const events = await getEventsFromOrganizerId({
    id: 'cljha48gt2ezx0bw13ujz2fwr',
    locale: defaultLocale,
  });
  console.log(events);
  return <EventSectionContent events={events} />;
}

export interface EventSectionContentProps {
  events: EventCard[];
}

async function EventSectionContent(props: EventSectionContentProps) {
  const events = props.events;
  const empty = !events.length;
  const user = await getCurrentUser();
  console.log('test', user);

  console.log('length', events.length);

  return (
    <>
      {empty ? (
        <p>No events for this organizer yet.</p>
      ) : (
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
                        <p className="text-sm text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardOverflow>
              <CardOverlay />
              <CardFooter variant="sticky">
                <Button className="w-full"> Deploy</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
