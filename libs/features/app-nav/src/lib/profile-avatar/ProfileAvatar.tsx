import { AppUser } from '@next/types';
import { Avatar, AvatarFallback, type AvatarProps } from '@ui/components';
import { emojiAvatarForAddress } from '@ui/shared';
import { useMemo } from 'react';

export interface ProfileAvatarProps extends Omit<AvatarProps, 'size'> {
  user: AppUser;
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
    user: { email, address },
    className,
  } = props;
  return EmojiAvatar({ ...props, className, address });
  // TODO: find way to get profile image
  // const fallBack = name ? getInitials(name) : '';
  // return profileImage || fallBack ? (
  //   <Avatar {...props} className={`${className} size-12`}>
  //     <AvatarImage
  //       src={profileImage || ''}
  //       className="flex items-center justify-center bg-muted"
  //     />
  //     <AvatarFallback>{fallBack}</AvatarFallback>
  //   </Avatar>
  // ) : (
  //   EmojiAvatar({ ...props, className, address: eoa })
  // );
}
