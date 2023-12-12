import { AppContainer, AppContainerOverflow } from '@features/app-nav';
import { EventPassListSkeleton } from '@features/cart';

export default function CartPurchaseLoading() {
  return (
    <AppContainer>
      <AppContainerOverflow>
        <EventPassListSkeleton />
      </AppContainerOverflow>
    </AppContainer>
  );
}
