import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import {
  Currency_Enum,
  EventPassNftContractType_Enum,
} from '@gql/shared/types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Sheet, SheetContent, Toaster } from '@ui/components';
import {
  eventPassNftVIPWithContract,
  eventPassNftVipNoContractDelayedReveal,
} from '../../molecules/EventPassNftFilesTable/examples';
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
    eventPassNftVIPWithContract,
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
      passAmount: null,
      passPricing: null,
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
      passAmount: {
        maxAmount: 200,
        timeBeforeDelete: 3600,
      },
      passPricing: {
        amount: 20000,
        currency: Currency_Enum.Eur,
      },
      eventPassNftContract: {
        contractAddress: '0xabcdef123456789',
        type: EventPassNftContractType_Enum.DelayedReveal,
        eventPassId: 'pass-2001',
        isDelayedRevealed: true,
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
    eventPassNftVipNoContractDelayedReveal,
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
      <Toaster />
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
