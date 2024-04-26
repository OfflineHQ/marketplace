import { OffKeyLogo } from '@features/unlock/app-nav';
import { Separator } from '@ui/components';
import { cn } from '@ui/shared';

export interface OffKeyHeaderProps {
  profile?: React.ReactNode;
  className?: string;
  title: React.ReactNode;
}

export const OffKeyHeader: React.FC<OffKeyHeaderProps> = ({
  profile,
  className,
  title,
}) => {
  return (
    <>
      <div
        className={cn(
          'flex items-center space-x-3 px-2 pt-1.5',
          profile ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        {profile ? null : <OffKeyLogo className="size-8" />}
        {title}
        {profile ? <div className="flex justify-end">{profile}</div> : null}
      </div>
      <Separator className="mt-1.5 w-full border-primary" />
    </>
  );
};
