'use client';
import { EventWithEventPassNfts } from '@features/pass-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
  Separator,
  Badge,
  Button,
  useToast,
  type DialogProps,
} from '@ui/components';
import { Reveal } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getErrorMessage } from '@utils';

export interface RevealPassesDialogClientProps extends DialogProps {
  eventPassNftContract: EventWithEventPassNfts['eventPassNftContracts'][0];
  numPassNotRevealed: number;
  children: React.ReactNode;
  batchDownloadOrReveal: (
    eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts']
  ) => Promise<void>;
}

export const RevealPassesDialogClient: React.FC<
  RevealPassesDialogClientProps
> = ({
  eventPassNftContract,
  numPassNotRevealed,
  children,
  batchDownloadOrReveal,
  ...dialogProps
}) => {
  const t = useTranslations('Pass.UserPass.UserPassEventCard');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const handleAction = async () => {
    const numPass = eventPassNftContract.eventPassNfts.length;
    try {
      await batchDownloadOrReveal(eventPassNftContract.eventPassNfts);
      setOpen(false);
      toast({
        title: t('dialog-toast-success-title'),
        description: t('dialog-toast-success-description', { numPass }),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('dialog-toast-error-title', { numPass }),
        description: t('dialog-toast-error-description', {
          numPass,
          errorMessage: getErrorMessage(error),
        }),
        variant: 'destructive',
      });
    }
  };
  return (
    <Dialog {...dialogProps} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog-title', { numPassNotRevealed })}</DialogTitle>
          <DialogDescription>
            {t.rich('dialog-description', {
              numPassNotRevealed,
              br: () => <br />,
            })}
          </DialogDescription>
        </DialogHeader>
        {eventPassNftContract.eventPassNfts.map((eventPassNft, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex items-center space-x-2">
              <Text>{t('pass-number', { number: eventPassNft.tokenId })}</Text>
              {eventPassNft.isRevealed ? (
                <Badge variant="green" size="sm">
                  {t('revealed')}
                </Badge>
              ) : (
                <Badge variant="orange" size="sm">
                  {t('not-revealed')}
                </Badge>
              )}
            </div>
            {index + 1 < eventPassNftContract.eventPassNfts.length && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            {t('dialog-cancel-button')}
          </Button>
          <Button icon={<Reveal />} onClick={handleAction}>
            {t('dialog-confirm-button', { numPassNotRevealed })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
