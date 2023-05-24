'use client';

import {
  PassPurchase,
  type PassPurchaseProps,
} from '@features/organizer/event';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export type PurchaseSectionClientProps = Omit<
  PassPurchaseProps,
  'onOpenChange' | 'open'
>;

export const PurchaseSectionClient: React.FC<PurchaseSectionClientProps> = (
  props
) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  useCallback(() => {
    console.log('useCallback in @purchase, open: ', open);
    if (!open) {
      router.back();
    }
  }, [open, router]);
  return <PassPurchase {...props} open={open} onOpenChange={setOpen} />;
};
