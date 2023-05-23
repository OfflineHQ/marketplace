import type { EventLayoutProps } from './layout';

export default function EventPage({
  eventSection,
  purchaseSection,
  children,
}: EventLayoutProps) {
  return (
    <>
      {eventSection}
      {purchaseSection}
      {children}
    </>
  );
}
