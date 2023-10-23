// examples.tsx
import { passTotalProps } from '../../molecules/PassTotal/examples';
import { PassList, PassListProps } from './PassList';

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
  // updatePassCart({ organizerSlug, eventSlug, pass: passWithMaxAmountCart });
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: passWithMaxAmountPerUserCart,
  // });
  return <PassList {...{ eventSlug, organizerSlug, ...props }} />;
};
