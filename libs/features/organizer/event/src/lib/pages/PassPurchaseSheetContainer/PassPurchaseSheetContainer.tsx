// PassPurchaseSheetContainer.tsx
import React from 'react';
import {
  type SheetProps,
  type SheetContentProps,
  Sheet,
  SheetContent,
} from '@ui/components';

export interface PassPurchaseSheetContainerProps
  extends Pick<SheetProps, 'open' | 'onOpenChange'> {
  children?: React.ReactNode;
}

export const PassPurchaseSheetContainer: React.FC<
  PassPurchaseSheetContainerProps
> = ({ open, onOpenChange, children }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
    </Sheet>
  );
};
