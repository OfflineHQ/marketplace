import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import { ContentSpaceFromOrganizerWithPasses } from '@features/back-office/content-spaces-types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Sheet, SheetContent } from '@ui/components';
import { eventPassesWorldCupFinale } from '../../organisms/ContentSpaceEventPassesTable/examples';
import { ContentSpaceSheet, ContentSpaceSheetProps } from './ContentSpaceSheet';

export const contentSpaceDataUndefined: ContentSpaceFromOrganizerWithPasses = {
  title: 'World cup exclusive content',
  eventPasses: eventPassesWorldCupFinale,
};

export const ContentSpaceSheetExample = (args: ContentSpaceSheetProps) => {
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <NextAuthProvider session={null}>
        <AuthProvider session={null} isConnected={() => true}>
          <Sheet open={true}>
            <SheetContent size={'full'}>
              <ContentSpaceSheet {...args} />
            </SheetContent>
          </Sheet>
        </AuthProvider>
      </NextAuthProvider>
    </AppNavLayout>
  );
};
