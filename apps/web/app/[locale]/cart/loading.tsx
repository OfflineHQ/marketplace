import { AppContainer, AppContainerOverflow } from '@features/app-nav';
import { EventPassListSkeleton } from '@features/cart';

export default function CartLoading() {
  return (
    <AppContainer>
      <AppContainerOverflow>
        <EventPassListSkeleton />
      </AppContainerOverflow>
    </AppContainer>
  );
}
