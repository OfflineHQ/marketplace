import { AvatarSkeleton, Text, TextSkeleton } from '@ui/components';
import { AvatarKey, AvatarKeyProps } from '../AvatarKey/AvatarKey';

export interface KeyRequiredProps extends AvatarKeyProps {
  name: string;
  description?: string;
}

export function KeyRequired({
  name,
  description,
  ...avatarProps
}: KeyRequiredProps) {
  return (
    <div className="flex items-center space-x-5">
      <AvatarKey {...avatarProps} />
      <div className="flex flex-col space-y-0.5">
        <Text variant="h6">{name}</Text>
        {description && (
          <Text variant="p" className="text-sm">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
}

export function KeyRequiredSkeleton() {
  return (
    <div className="flex items-center space-x-5">
      <AvatarSkeleton />
      <div className="flex flex-col space-y-1">
        <TextSkeleton variant="h6" />
        <TextSkeleton variant="p" />
      </div>
    </div>
  );
}
