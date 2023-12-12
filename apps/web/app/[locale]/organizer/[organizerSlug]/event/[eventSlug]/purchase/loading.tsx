import { AppContainer } from '@features/app-nav';
import { PassPurchaseSheetSkeleton } from '@features/organizer/event';

export default function PurchaseLoading() {
  return (
    <AppContainer>
      <PassPurchaseSheetSkeleton size="full" />
    </AppContainer>
  );
}
