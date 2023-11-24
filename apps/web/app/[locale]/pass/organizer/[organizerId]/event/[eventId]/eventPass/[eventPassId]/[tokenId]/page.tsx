import {
  getEventPassNftByTokenReferenceAnonymous,
  getEventPassNftByTokenReferenceUser,
} from '@features/pass-api';
import { EventPassNft } from '@features/pass-types';
import { SinglePass } from '@features/pass/server';
import type { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { notFound } from 'next/navigation';

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
  if (!eventPassNft) {
    return notFound();
  }
  return <SinglePass user={user} eventPassNft={eventPassNft} />;
}
