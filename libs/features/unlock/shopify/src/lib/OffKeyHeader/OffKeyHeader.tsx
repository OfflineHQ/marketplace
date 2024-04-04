import { OffKeyLogo } from '@features/unlock/app-nav';
import { Separator, Text } from '@ui/components';

export interface OffKeyHeaderProps {
  profile?: React.ReactNode;
  title: string;
}

export const OffKeyHeader: React.FC<OffKeyHeaderProps> = ({
  profile,
  title,
}) => {
  return (
    <>
      <div className="flex items-center space-x-3 px-2">
        {profile ? null : <OffKeyLogo className="size-8" />}
        <Text variant="h6">{title}</Text>
        {profile ? <div className="flex justify-end">{profile}</div> : null}
      </div>
      <Separator className="mt-2 w-full border-primary" />
    </>
  );
};
