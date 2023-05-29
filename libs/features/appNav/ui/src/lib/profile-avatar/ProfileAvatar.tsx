import { useMemo } from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  type AvatarProps,
} from '@ui/components';
import { emojiAvatarForAddress } from '@ui/shared';
import type { SafeUser } from '@client/auth';

export interface ProfileAvatarProps extends Omit<AvatarProps, 'size'> {
  user: SafeUser;
}

export interface EmojiAvatarProps extends Omit<AvatarProps, 'size'> {
  address: string;
}

function EmojiAvatar({ address, ...props }: EmojiAvatarProps) {
  const { color, emoji } = useMemo(
    () => emojiAvatarForAddress(address),
    [address]
  );
  return (
    <Avatar {...props}>
      <AvatarFallback style={{ backgroundColor: color }}>
        {emoji}
      </AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string) {
  const words = name.split(' ');
  const firstWordInitial = words[0].charAt(0).toUpperCase();
  const lastWordInitial =
    words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';

  return firstWordInitial + lastWordInitial;
}

export function ProfileAvatar(props: ProfileAvatarProps) {
  const {
    user: { name, profileImage, eoa },
  } = props;
  const fallBack = name ? getInitials(name) : '';
  const className = 'w-12 h-12';
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
