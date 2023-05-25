'use client';

import {
  PassPurchase,
  type PassPurchaseProps,
} from '@features/organizer/event';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface PurchaseSectionClientProps
  extends Omit<PassPurchaseProps, 'onOpenChange' | 'open'> {
  backRoute?: string;
}

export const PurchaseSectionClient: React.FC<PurchaseSectionClientProps> = ({
  backRoute,
  ...props
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    console.log('useEffect in purchase, open: ', open);
    if (!open) {
      if (backRoute) router.push(backRoute);
      else router.back();
    }
  }, [open, router, backRoute]);
  return <PassPurchase {...props} open={open} onOpenChange={setOpen} />;
};
