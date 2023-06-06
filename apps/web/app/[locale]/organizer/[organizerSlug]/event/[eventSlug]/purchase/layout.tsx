import { PassPurchaseSheetContainer } from '@features/organizer/event';

export default function PurchaseTemplate({
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
