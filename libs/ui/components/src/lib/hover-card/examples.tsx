import { OutlineCalendarDays } from '@ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

export function HoverCardDemo() {
  return (
    <div className="flex">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
              </p>
              <div className="flex items-center pt-2">
                <OutlineCalendarDays className="mr-2 size-4 opacity-70" />{' '}
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
