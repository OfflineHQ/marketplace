'use client';
import { SheetNavigation, type SheetNavigationProps } from '@ui/components';
import { useRouter } from 'next/navigation';

export type PassPurchaseSheetNavigationClientProps = SheetNavigationProps;

export const PassPurchaseSheetNavigationClient: React.FC<
  PassPurchaseSheetNavigationClientProps
> = ({ backButtonText, size }) => {
  const router = useRouter();
  return (
    <SheetNavigation
      backButtonAction={() => router.back()}
      backButtonText={backButtonText}
      size={size}
    />
  );
};
