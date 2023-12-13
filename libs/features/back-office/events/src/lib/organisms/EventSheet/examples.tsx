import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import {
  Currency_Enum,
  EventPassNftContractType_Enum,
} from '@gql/shared/types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Sheet, SheetContent } from '@ui/components';
import {
  EventSheet,
  EventSheetSkeleton,
  type EventSheetProps,
} from './EventSheet';

export const eventWithNormalPasses: EventSheetProps['event'] = {
  title: 'Epic Music Festival',
  id: 'evt-12345',
  slug: 'epic-music-festival',
  eventPasses: [
    {
      __typename: 'EventPass',
      name: 'VIP Access',
      id: 'pass-1001',
      description:
        'Exclusive VIP pass with backstage access and premium seating',
      nftName: 'EpicFestVIP',
      nftDescription:
        'Limited Edition NFT for VIP attendees of Epic Music Festival',
      nftImage: {
        url: 'https://picsum.photos/id/620/350/350',
      },
      passOptions: [],
      eventPassPricing: {
        maxAmount: 100,
        priceAmount: 42500,
        priceCurrency: Currency_Enum.Eur,
        timeBeforeDelete: 3600,
      },
      eventPassNftContract: {
        contractAddress: '0x123456789abcdef',
        type: EventPassNftContractType_Enum.Normal,
        eventPassId: 'pass-1001',
      },
    },
    {
      name: 'General Admission',
      id: 'pass-1002',
      description: 'General admission pass with access to all public areas',
      nftName: 'EpicFestGA',
      nftDescription: 'General Admission NFT for Epic Music Festival',
      nftImage: {
        url: 'https://picsum.photos/id/621/350/350',
      },
      passOptions: [],
      eventPassPricing: null,
      eventPassNftContract: null,
    },
  ],
};

export const eventWithDelayedPasses: EventSheetProps['event'] = {
  title: 'Delayed Passes Event',
  id: 'evt-67890',
  slug: 'delayed-passes-event',
  eventPasses: [
    {
      __typename: 'EventPass',
      name: 'Early Bird',
      id: 'pass-2001',
      description: 'Early bird pass to be revealed later',
      nftName: 'DelayedEventEarlyBird',
      nftDescription:
        'Early Bird NFT for Delayed Passes Event to be revealed later',
      nftImage: {
        url: 'https://picsum.photos/id/622/350/350',
      },
      passOptions: [],
      eventPassPricing: {
        maxAmount: 200,
        priceAmount: 20000,
        priceCurrency: Currency_Enum.Eur,
        timeBeforeDelete: 3600,
      },
      eventPassNftContract: {
        contractAddress: '0xabcdef123456789',
        type: EventPassNftContractType_Enum.DelayedReveal,
        eventPassId: 'pass-2001',
      },
      eventPassDelayedRevealed: {
        name: 'Early Bird Revealed',
        description: 'Early bird pass with discounted price',
        nftName: 'RevealedEventEarlyBird',
        nftDescription: 'Early Bird NFT for Delayed Passes Event',
        nftImage: {
          url: 'https://picsum.photos/id/625/350/350',
        },
        passOptions: [],
      },
    },
    {
      name: 'VIP Access',
      id: 'pass-2002',
      description: 'VIP pass to be revealed later',
      nftName: 'DelayedEventVIP',
      nftDescription: 'VIP NFT for Delayed Passes Event to be revealed later',
      nftImage: {
        url: 'https://picsum.photos/id/623/350/350',
      },
      passOptions: [],
      eventPassPricing: {
        maxAmount: 100,
        priceAmount: 28000,
        priceCurrency: Currency_Enum.Eur,
        timeBeforeDelete: 3600,
      },
      eventPassNftContract: null,
      eventPassDelayedRevealed: {
        name: 'VIP Access Revealed',
        description: 'VIP pass with exclusive benefits',
        nftName: 'RevealedEventVIP',
        nftDescription: 'VIP NFT for Delayed Passes Event',
        nftImage: {
          url: 'https://picsum.photos/id/626/350/350',
        },
        passOptions: [],
      },
    },
  ],
};

export const EventSheetExample = (props: EventSheetProps) => {
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <NextAuthProvider session={null}>
        <AuthProvider session={null} isConnected={() => true}>
          <Sheet open={true}>
            <SheetContent size={'full'}>
              <EventSheet {...props} />
            </SheetContent>
          </Sheet>
        </AuthProvider>
      </NextAuthProvider>
    </AppNavLayout>
  );
};

export const EventSheetSkeletonExample = () => {
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <Sheet open={true}>
        <SheetContent size={'full'}>
          <EventSheetSkeleton />
        </SheetContent>
      </Sheet>
    </AppNavLayout>
  );
};
