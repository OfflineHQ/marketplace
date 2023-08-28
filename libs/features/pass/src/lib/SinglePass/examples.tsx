import {
  passWithMaxAmount,
  eventProps,
} from '@features/organizer/event/examples';
import { SinglePass, type SinglePassProps } from './SinglePass';
import { rtfWithImageProps, rtfProps } from '@next/hygraph/examples';

import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';

export const eventPassNft1 = {
  id: 'dummy',
  tokenId: '12',
  eventId: eventProps.id,
  eventPassId: passWithMaxAmount.id,
  organizerId: eventProps?.organizer?.id ?? '',
  isRevealed: false,
  currentOwnerAddress: '0x123',
  eventPass: {
    ...passWithMaxAmount,
    nftImage: {
      url: 'https://picsum.photos/id/620/350/350',
    },
    event: {
      ...eventProps,
      description: {
        json: rtfWithImageProps.content,
        references: [
          {
            __typename: 'Asset',
            id: 'cknjbzowggjo90b91kjisy03a',
            url: 'https://media.graphassets.com/dsQtt0ARqO28baaXbVy9',
            mimeType: 'image/png',
          },
        ],
      },
    },
  },
} satisfies SinglePassProps['eventPassNft'];

export function SinglePassNoUserExample(props: SinglePassProps) {
  return (
    <AppNavLayout {...WithNoUser.args} children={<SinglePass {...props} />} />
  );
}
