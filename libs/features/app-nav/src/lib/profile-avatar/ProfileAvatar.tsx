import type { SafeUser } from '@next/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from '@ui/components';
import { emojiAvatarForAddress, getInitials } from '@ui/shared';
import { useMemo } from 'react';

export interface ProfileAvatarProps extends Omit<AvatarProps, 'size'> {
  user: SafeUser;
}

export interface EmojiAvatarProps extends Omit<AvatarProps, 'size'> {
  address: string;
}

function EmojiAvatar({ address, ...props }: EmojiAvatarProps) {
  const { color, emoji } = useMemo(
    () => emojiAvatarForAddress(address),
    [address],
  );
  return (
    <Avatar {...props}>
      <AvatarFallback style={{ backgroundColor: color }}>
        {emoji}
      </AvatarFallback>
    </Avatar>
  );
}

export function ProfileAvatar(props: ProfileAvatarProps) {
  const {
    user: { name, profileImage, eoa },
    className,
  } = props;
  const fallBack = name ? getInitials(name) : '';
  return profileImage || fallBack ? (
    <Avatar {...props} className={`${className} h-12 w-12`}>
      <AvatarImage
        src={profileImage || ''}
        className="flex items-center justify-center bg-muted"
      />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  ) : (
    EmojiAvatar({ ...props, className, address: eoa })
  );
}
