// PassPurchaseSheetContainer.tsx
import { SheetContent, type SheetContentProps } from '@ui/components';
import React from 'react';

export interface PassPurchaseSheetContainerProps extends SheetContentProps {
  children?: React.ReactNode;
}

export const PassPurchaseSheetContainer: React.FC<
  PassPurchaseSheetContainerProps
> = ({ children, size = 'lg' }) => {
  return (
    <SheetContent variant="stickyFooter" size={size}>
      {children}
    </SheetContent>
  );
};
