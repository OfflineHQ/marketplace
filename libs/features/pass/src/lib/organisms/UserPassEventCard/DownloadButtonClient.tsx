'use client';

import { Button, useToast } from '@ui/components';
import { Download } from '@ui/icons';

import { EventWithEventPassNfts } from '@features/pass-types';
import { nextAuthCookieName } from '@next/next-auth/common';
import { getCookie } from 'cookies-next';

interface DownloadButtonClientProps {
  eventPassNftContract: EventWithEventPassNfts['eventPassNftContracts'][0];
  batchDownloadOrReveal: (
    eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts'],
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
      const jwt = getCookie(nextAuthCookieName());
      console.log(jwt);
      const response = await fetch(
        `https://upcdn.io/***REMOVED***/raw/local/users/0xb1A6D06913695CF31262D42a1e39E19ca9f2121d/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png?auth=true?download=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        },
      );
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
    <Button className="w-full" icon={<Download />} block onClick={handleAction}>
      {buttonTxt}
    </Button>
  );
};
