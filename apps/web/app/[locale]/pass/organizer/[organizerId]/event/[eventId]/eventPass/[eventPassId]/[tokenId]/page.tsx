import { SinglePass } from '@features/pass/server';
import { EventPassNft } from '@features/pass-types';
import { getCurrentUser } from '@next/next-auth/user';
import {
  getEventPassNftByTokenReferenceUser,
  getEventPassNftByTokenReferenceAnonymous,
} from '@features/pass-api';
import type { Locale } from '@gql/shared/types';

export interface SinglePassPageProps {
  params: {
    locale: Locale;
    organizerId: string;
    eventId: string;
    eventPassId: string;
    tokenId: string;
  };
}

export default async function SinglePassPage({ params }: SinglePassPageProps) {
  const { locale, organizerId, eventId, eventPassId, tokenId } = params;
  const user = await getCurrentUser();
  let eventPassNft: EventPassNft | null | undefined;
  if (user) {
    eventPassNft = await getEventPassNftByTokenReferenceUser({
      organizerId,
      eventId,
      eventPassId,
      tokenId,
      locale,
    });
  } else {
    eventPassNft = await getEventPassNftByTokenReferenceAnonymous({
      organizerId,
      eventId,
      eventPassId,
      tokenId,
      locale,
    });
  }
  console.log('eventPassNft', eventPassNft, {
    organizerId,
    eventId,
    eventPassId,
    tokenId,
  });
  if (!eventPassNft) {
    // TODO redirect to 404
    return null;
  }
  return <SinglePass user={user} eventPassNft={eventPassNft} />;
}
