// examples.tsx
import { PassList, PassListProps } from './PassList';
import { passTotalProps } from '../../molecules/PassTotal/examples';
import { usePassPurchaseStore } from '@features/organizer/event/store';

import {
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
} from '../../molecules/PassCard/examples';

export const passListProps = {
  passes: passTotalProps['passesData'],
  eventSlug: 'event-slug',
  organizerSlug: 'organizer-slug',
} satisfies PassListProps;

export const PassListBoundaryMaxExample = ({
  organizerSlug,
  eventSlug,
  ...props
}: PassListProps) => {
  const updatePassCart = usePassPurchaseStore((state) => state.updatePassCart);
  updatePassCart({ organizerSlug, eventSlug, pass: passWithMaxAmountCart });
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: passWithMaxAmountPerUserCart,
  });
  return <PassList {...{ eventSlug, organizerSlug, ...props }} />;
};
