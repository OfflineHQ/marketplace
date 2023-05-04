import { useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@ui/components';
import { emojiAvatarForAddress } from '@ui/shared';
import type { SafeUser } from '@client/auth';

export interface ProfileAvatarProps {
  user: SafeUser;
}

function EmojiAvatar(props, address) {
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
  const className = 'w-10 h-10 sm:w-10 sm:h-10';
  return profileImage || fallBack ? (
    <Avatar {...props} className={className}>
      <AvatarImage src={profileImage || ''} />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  ) : (
    EmojiAvatar({ ...props, className }, eoa)
  );
}

export default ProfileAvatar;
