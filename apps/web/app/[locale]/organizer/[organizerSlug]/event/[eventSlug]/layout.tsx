export interface EventLayoutProps {
  children: React.ReactNode;
  purchase: React.ReactNode;
}

export default function EventLayout({ children, purchase }: EventLayoutProps) {
  return (
    <section className="container mx-auto">
      {children}
      {purchase}
    </section>
  );
}
