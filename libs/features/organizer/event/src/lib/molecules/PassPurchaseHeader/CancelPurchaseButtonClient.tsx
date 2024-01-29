'use client';

import { usePathname, useRouter } from '@next/navigation';
import { Button, useToast } from '@ui/components';
import { Close } from '@ui/icons';
import { useState } from 'react';
import { cancelPurchaseForUser } from './action';

export function CancelPurchaseButton({
  buttonText,
  successText,
  errorText,
}: {
  buttonText: string;
  successText: { title: string; description: string };
  errorText: { title: string; description: string };
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleCancelPurchase = async () => {
    setIsLoading(true);
    try {
      await cancelPurchaseForUser();
      toast({
        title: successText.title,
        description: successText.description,
      });
      if (pathname.includes('/cart/canceled')) {
        router.push('/cart');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to cancel purchase', error);
      toast({
        title: errorText.title,
        description: errorText.description,
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
      {buttonText}
    </Button>
  );
}
