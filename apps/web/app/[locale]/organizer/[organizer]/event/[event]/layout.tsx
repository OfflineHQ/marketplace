export interface EventLayoutProps {
  children: React.ReactNode;
  sheet: React.ReactNode; // TODO parallel route for sheet to display alternatively the event passes directly
}

export default function EventLayout({ children, sheet }: EventLayoutProps) {
  return (
    <section className="container mx-auto">
      {children}
      {sheet}
    </section>
  );
}
