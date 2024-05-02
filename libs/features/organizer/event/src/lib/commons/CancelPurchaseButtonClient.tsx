'use client';

import { usePathname, useRouter } from '@next/navigation';
import { Button, useToast } from '@ui/components';
import { Close } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cancelPurchaseForUser } from './action';

export function CancelPurchaseButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const t = useTranslations('Organizer.Event.PassPurchaseHeader');

  const handleCancelPurchase = async () => {
    setIsLoading(true);
    try {
      await cancelPurchaseForUser();
      toast({
        title: t('cancel-purchase-success-title'),
        description: t('cancel-purchase-success-description'),
      });
      if (pathname.includes('/cart/canceled')) {
        router.push('/cart');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to cancel purchase', error);
      toast({
        title: t('cancel-purchase-error-title'),
        description: t('cancel-purchase-error-description'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="link"
      className="px-0"
      icon={isLoading ? <></> : <Close />} // Mock loading indicator for demonstration
      onClick={handleCancelPurchase}
      isLoading={isLoading}
    >
      {t('cancel-purchase')}
    </Button>
  );
}
