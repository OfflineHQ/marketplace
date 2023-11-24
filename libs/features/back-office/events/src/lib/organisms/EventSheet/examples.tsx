import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import { Currency_Enum } from '@gql/shared/types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Sheet, SheetContent } from '@ui/components';
import { EventSheet, type EventSheetProps } from './EventSheet';

export const event: EventSheetProps['event'] = {
  title: 'Epic Music Festival',
  id: 'evt-12345',
  slug: 'epic-music-festival',
  heroImage: {
    url: 'https://picsum.photos/seed/hero/800/450',
  },
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
      eventPassPricing: {
        maxAmount: 100,
        priceAmount: 42500,
        priceCurrency: Currency_Enum.Eur,
      },
      eventPassNftContract: {
        contractAddress: '0x123456789abcdef',
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
      eventPassPricing: null,
      eventPassNftContract: null,
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
