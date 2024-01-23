import {
  event2Props,
  eventProps,
  passPremium,
  passWithMaxAmount,
} from '@features/organizer/event/examples';
import type { User } from 'next-auth';
import {
  SinglePass,
  SinglePassSkeleton,
  type SinglePassProps,
} from './SinglePass';

import { AppNavLayout } from '@features/app-nav';
import { WithNoUser, WithNormalUser } from '@features/app-nav/stories';

export const owner: User = {
  id: '123',
  address: '0x123',
};

export const eventPassNft1 = {
  id: 'dummy',

  tokenId: '1224',
  eventId: eventProps.id,
  eventPassId: passWithMaxAmount.id,
  organizerId: eventProps?.organizer?.id ?? '',
  isRevealed: false,
  currentOwnerAddress: owner.address,
  eventPass: {
    ...passWithMaxAmount,
    nftImage: {
      url: 'https://picsum.photos/id/620/350/350',
    },
    event: {
      ...eventProps,
    },
  },
} satisfies SinglePassProps['eventPassNft'];

export const eventPassNft2 = {
  id: 'dummy2',
  tokenId: '12',
  eventId: event2Props.id,
  eventPassId: passPremium.id,
  organizerId: event2Props?.organizer?.id ?? '',
  isRevealed: true,
  currentOwnerAddress: owner.address,
  eventPass: {
    ...passPremium,
    nftImage: {
      url: 'https://picsum.photos/id/621/350/350',
    },
    event: {
      ...event2Props,
    },
  },
} satisfies SinglePassProps['eventPassNft'];

export function SinglePassNoUserExample(props: SinglePassProps) {
  return (
    <AppNavLayout {...WithNoUser.args}>
      <SinglePass {...props} />
    </AppNavLayout>
  );
}

export function SinglePassOwnerExample(props: SinglePassProps) {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <SinglePass {...props} />
    </AppNavLayout>
  );
}

export function SinglePassSkeletonExample() {
  return (
    <AppNavLayout {...WithNoUser.args}>
      <SinglePassSkeleton />
    </AppNavLayout>
  );
}
