import { PassPurchaseSheetContainer } from '@features/organizer/event';

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PassPurchaseSheetContainer open={true} size="full">
      {children}
    </PassPurchaseSheetContainer>
  );
}
