import { useMemo } from 'react';
import type { Session } from 'next-auth';
import { Avatar, AvatarImage, AvatarFallback } from '@ui/components';
import { emojiAvatarForAddress } from '@ui/shared';

export interface ProfileAvatarProps {
  session: Session;
}

function EmojiAvatar(props, address) {
  const { color, emoji } = useMemo(() => emojiAvatarForAddress(address), [address]);
  return (
    <Avatar {...props}>
      <AvatarFallback style={{ backgroundColor: color }}>{emoji}</AvatarFallback>
    </Avatar>
  );
}

export function ProfileAvatar(props: ProfileAvatarProps) {
  const {
    session: {
      address,
      user: { firstName, lastName, image },
    },
  } = props;
  const fallBack = firstName && lastName ? `${firstName[0]}${lastName[0]}` : '';
  return image || fallBack ? (
    <Avatar {...props}>
      <AvatarImage src={image || ''} />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  ) : (
    EmojiAvatar(props, address)
  );
}

export default ProfileAvatar;
