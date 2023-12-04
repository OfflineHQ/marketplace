import { isConnected } from '@next/next-auth/user';
import { ButtonSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { isFollowingOrganizer } from '../actions/isFollowingOrganizer';
import {
  OrganizerFollowButtonClient,
  type OrganizerFollowButtonClientProps,
} from './OrganizerFollowButtonClient';

export type OrganizerFollowButtonProps = Omit<
  OrganizerFollowButtonContentProps,
  'text'
>;
type OrganizerFollowButtonContentProps = Omit<
  OrganizerFollowButtonClientProps,
  'isConnected'
>;

const OrganizerFollowButtonContent = async ({
  slug,
  ...props
}: OrganizerFollowButtonContentProps) => {
  const isUserConnected = await isConnected();
  let isFollowing = false;
  if (isUserConnected) {
    isFollowing = await isFollowingOrganizer(slug);
  }
  return (
    <OrganizerFollowButtonClient
      {...props}
      isConnected={isUserConnected}
      pressed={isFollowing}
      slug={slug}
    />
  );
};

export const OrganizerFollowButton = ({
  name,
  ...props
}: OrganizerFollowButtonProps) => {
  const t = useTranslations('Organizer.OrganizerFollowButton');
  const text = {
    follow: t('follow'),
    unfollow: t('unfollow'),
    helperTextFollow: t('helperTextFollow', { name }),
    helperTextUnfollow: t('helperTextUnfollow', { name }),
  };
  return (
    <Suspense fallback={<ButtonSkeleton />}>
      <OrganizerFollowButtonContent name={name} text={text} {...props} />
    </Suspense>
  );
};
