import {
  DropdownMenuActions,
  type DropdownMenuActionsProps,
  type ToastT,
} from '@ui/components';
import { Download, Reveal, SeeDetails, Send } from '@ui/icons';
import type { EventWithEventPassNfts } from '@features/pass-types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { ErrorWithMessageAndCode } from '@utils';

export type UserPassEventPassActionsFunctionsProps = {
  actionsFunctions: {
    downloadPass: (id: string) => void;
    revealPass: (id: string) => void;
    sendPass?: () => void;
  };
};

export interface UserPassEventPassActionsProps
  extends UserPassEventPassActionsFunctionsProps {
  eventPassNft: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts'][0];
  eventPass: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPass'];
  event: EventWithEventPassNfts['event'];
  organizer: EventWithEventPassNfts['organizer'];
}

export const UserPassEventPassActions: React.FC<
  UserPassEventPassActionsProps
> = ({ eventPassNft, eventPass, event, organizer, actionsFunctions }) => {
  const t = useTranslations('Pass.UserPass.UserPassEventPassActions');
  const items: DropdownMenuActionsProps['items'] = [
    {
      type: 'item',
      wrapper: (
        <Link
          href={`/pass/organizer/${organizer?.id}/event/${event?.id}/eventPass/${eventPass.id}/${eventPassNft.tokenId}`}
        />
      ),
      icon: <SeeDetails />,
      text: t('see-details'),
    },
  ];

  async function downloadPass() {
    'use server';
    return actionsFunctions.downloadPass(eventPassNft.id);
  }

  async function revealPass() {
    'use server';
    return actionsFunctions.revealPass(eventPassNft.id);
  }

  const revealPassToastErrors = {
    title: t('action-reveal-toast-error-title'),
    description: t('action-reveal-toast-error-description'),
  };

  async function revealPassToastError(
    error: ErrorWithMessageAndCode
  ): Promise<ToastT> {
    'use server';
    console.error('UserPassEventPassActions', error);
    // TODO: handle error, in case get error code and message display message in toast
    return {
      ...revealPassToastErrors,
      variant: 'destructive',
    };
  }

  if (eventPassNft?.isRevealed) {
    items.push({
      type: 'item',
      icon: <Download />,
      text: t('download-pass'),
      action: downloadPass,
    });
  } else {
    items.push({
      type: 'item',
      icon: <Reveal />,
      text: t('reveal-pass'),
      action: revealPass,
      toastError: revealPassToastError,
    });
  }
  items.push({
    type: 'item',
    icon: <Send />,
    text: t('send-pass'),
    disabled: true,
  });

  return <DropdownMenuActions helperText={t('helper-text')} items={items} />;
};
