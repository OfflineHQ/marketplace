import { BellRing, Check } from '@ui/icons';

import { cn } from '@ui/shared';
import { Button, ButtonSkeleton } from '../button/Button';
import { Switch } from '../switch/Switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardDescriptionSkeleton,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardTitle,
  CardTitleSkeleton,
} from './Card';

import { Input } from '../input/Input';
import { Label } from '../label/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/Select';
import { TextSkeleton } from '../text/Text';

const notifications = [
  {
    title: 'Your call has been confirmed.',
    description: '1 hour ago',
  },
  {
    title: 'You have a new message!',
    description: '1 hour ago',
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
];

type CardProps = React.ComponentProps<typeof Card>;

function CardNotifications(
  notifications: any[],
  { className, ...props }: CardProps,
) {
  return (
    <Card className={cn('w-full md:w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <BellRing size="lg" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch />
        </div>
      </CardHeader>
      <CardOverflow>
        <CardContent className="grid gap-4">
          <div>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </CardOverflow>
      <CardFooter>
        <Button className="w-full" icon={<Check />}>
          Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardDemo({ className, ...props }: CardProps) {
  return CardNotifications(notifications, { className, ...props });
}

const manyNotifications = [
  ...notifications,
  ...notifications,
  ...notifications,
];

export function CardWithOverflow({ className, ...props }: CardProps) {
  return CardNotifications(manyNotifications, { className, ...props });
}

export function CardWithForm() {
  return (
    <Card className="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Framework</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

export function CardSkeleton({ variant = 'default' }: CardProps) {
  return (
    <Card className="w-full md:w-[380px]" variant={variant}>
      <CardHeader>
        <CardTitleSkeleton />
        <CardDescriptionSkeleton />
      </CardHeader>
      <CardContent className="grid gap-4">
        <TextSkeleton className="h-4" />
        <TextSkeleton className="h-4" />
      </CardContent>
      <CardFooter>
        <ButtonSkeleton className="w-full" />
      </CardFooter>
    </Card>
  );
}
