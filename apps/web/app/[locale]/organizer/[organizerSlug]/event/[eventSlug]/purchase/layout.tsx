import { Card } from '@ui/components';

export default function PurchaseTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card variant="stickyFooter" noBorder className="container mx-auto h-full">
      {children}
    </Card>
  );
}
