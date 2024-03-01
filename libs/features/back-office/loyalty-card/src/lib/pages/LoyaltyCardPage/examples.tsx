import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import { LoyaltyCardOrganizer } from '@features/back-office/loyalty-card-types';
import { LoyaltyCardPage, LoyaltyCardPageProps } from './LoyaltyCardPage';

export const loyaltyCard = {
  id: '1',
  nftName: 'Loyalty Card for Organizer Brand',
  nftImage: {
    url: 'https://picsum.photos/id/621/850/850',
  },
} satisfies LoyaltyCardOrganizer;

export function LoyaltyCardPageDemo(props: LoyaltyCardPageProps) {
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <LoyaltyCardPage {...props} />
    </AppNavLayout>
  );
}
