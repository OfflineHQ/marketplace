'use client';

import { Button, useToast } from '@ui/components';
import { Download } from '@ui/icons';

import { EventWithEventPassNfts } from '@features/pass-types';

interface DownloadButtonClientProps {
  eventPassNftContract: EventWithEventPassNfts['eventPassNftContracts'][0];
  batchDownloadOrReveal: (
    eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts']
  ) => Promise<void>;
  buttonTxt: string;
  buttonToastTxt: {
    successTitle: string;
    successComment: string;
    errorTitle: string;
    errorComment: string;
  };
}

export const DownloadButtonClient: React.FC<DownloadButtonClientProps> = ({
  eventPassNftContract,
  batchDownloadOrReveal,
  buttonTxt,
  buttonToastTxt: { successTitle, successComment, errorTitle, errorComment },
}) => {
  const { toast } = useToast();
  const handleAction = async () => {
    try {
      await batchDownloadOrReveal(eventPassNftContract.eventPassNfts);
      toast({
        title: successTitle,
        description: successComment,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: errorTitle,
        description: errorComment,
        variant: 'destructive',
      });
    }
  };
  return (
    <Button className="w-full" icon={<Download />} block action={handleAction}>
      {buttonTxt}
    </Button>
  );
};
