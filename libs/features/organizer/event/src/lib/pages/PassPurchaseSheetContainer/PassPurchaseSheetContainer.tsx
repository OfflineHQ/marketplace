// PassPurchaseSheetContainer.tsx
import React from 'react';
import {
  type SheetProps,
  type SheetContentProps,
  Sheet,
  SheetContent,
} from '@ui/components';

export interface PassPurchaseSheetContainerProps
  extends Pick<SheetProps, 'open' | 'onOpenChange'>,
    SheetContentProps {
  children?: React.ReactNode;
}

export const PassPurchaseSheetContainer: React.FC<
  PassPurchaseSheetContainerProps
> = ({ open, onOpenChange, children, size = 'lg' }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent variant="stickyFooter" size={size}>
        {children}
      </SheetContent>
    </Sheet>
  );
};
