'use client';

import { PassPurchaseSheetContainer } from '@features/organizer/event';
import { usePathname } from 'next/navigation';

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <PassPurchaseSheetContainer open={pathname?.includes('/purchase')}>
      {children}
    </PassPurchaseSheetContainer>
  );
}
