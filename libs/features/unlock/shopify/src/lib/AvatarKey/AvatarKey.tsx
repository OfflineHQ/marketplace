import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  IconBadgeWrapper,
} from '@ui/components';
import { LockKey, LockKeyOpen } from '@ui/icons';

export interface AvatarKeyProps {
  imgSrc?: string;
  isOwned?: boolean;
}

export const AvatarKey: React.FC<AvatarKeyProps> = ({ imgSrc, isOwned }) => {
  return (
    <IconBadgeWrapper
      className={
        isOwned
          ? 'border-b bg-background p-0.5'
          : 'border-b bg-background p-0.5'
      }
      icon={
        isOwned !== undefined ? (
          isOwned ? (
            <LockKeyOpen color="success" />
          ) : (
            <LockKey color="warning" />
          )
        ) : undefined
      }
    >
      <Avatar>
        <AvatarImage src={imgSrc} />
        <AvatarFallback>🔑</AvatarFallback>
      </Avatar>
    </IconBadgeWrapper>
  );
};
