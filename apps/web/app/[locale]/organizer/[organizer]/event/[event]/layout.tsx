export interface EventLayoutProps {
  children: React.ReactNode;
  eventSection: React.ReactNode;
  purchaseSection: React.ReactNode;
}

export default function EventLayout({
  children,
  eventSection,
  purchaseSection,
}: EventLayoutProps) {
  return (
    <section className="container mx-auto">
      {children}
      {eventSection}
      {purchaseSection}
    </section>
  );
}
