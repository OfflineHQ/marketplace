import { useMemo } from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  type AvatarProps,
} from '@ui/components';
import { emojiAvatarForAddress, getInitials } from '@ui/shared';
import type { SafeUser } from '@next/auth';

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
  } = props;
  const fallBack = name ? getInitials(name) : '';
  const className = 'w-12 h-12';
  // const className = '';
  return profileImage || fallBack ? (
    <Avatar {...props} className={className}>
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

export default ProfileAvatar;
