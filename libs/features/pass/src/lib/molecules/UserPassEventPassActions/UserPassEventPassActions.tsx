import type { EventWithEventPassNfts } from '@features/pass-types';
import { getNextAppURL } from '@shared/server';
import {
  DropdownMenuActions,
  type DropdownMenuActionsProps,
  type ToastT,
} from '@ui/components';
import { Download, Reveal, SeeDetails, Send } from '@ui/icons';
import type { ErrorWithMessage } from '@utils';
import { slugify } from '@utils';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { slugify } from '@utils';


export type UserPassEventPassActionsFunctionsProps = {
  actionsFunctions: {
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
  const locale = useLocale();
  const items: DropdownMenuActionsProps['items'] = [
    {
      type: 'item',
      wrapper: (
        <Link
          href={`/${locale}/pass/organizer/${organizer?.id}/event/${event?.id}/eventPass/${eventPass?.id}/${eventPassNft?.tokenId}`}
        />
      ),
      icon: <SeeDetails />,
      text: t('see-details'),
    },
  ];

  const downloadPassToastErrors = {
    title: t('action-download-toast-error-title'),
    description: t('action-download-toast-error-description'),
  };

  const downloadPassToastSuccessMessages = {
    title: t('action-download-toast-success-title'),
    description: t('action-download-toast-success-description'),
  };

  async function downloadPassToastError(
    error: ErrorWithMessage,
  ): Promise<ToastT> {
    'use server';
    return {
      title: downloadPassToastErrors.title,
      description: error?.message
        ? downloadPassToastErrors.description + ' ' + error.message
        : downloadPassToastErrors.description,
      variant: 'destructive',
    };
  }

  async function downloadPassToastSuccess(props: unknown): Promise<ToastT> {
    'use server';
    return downloadPassToastSuccessMessages;
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
    error: ErrorWithMessage,
  ): Promise<ToastT> {
    'use server';
    // TODO: handle error, in case get error code and message display message in toast
    return {
      title: revealPassToastErrors.title,
      description: error?.message
        ? revealPassToastErrors.description + ' ' + error.message
        : revealPassToastErrors.description,
      variant: 'destructive',
    };
  }

  const revealPassToastSuccessMessages = {
    title: t('action-reveal-toast-success-title'),
    description: t('action-reveal-toast-success-description'),
  };

  async function revealPassToastSuccess(props: unknown): Promise<ToastT> {
    'use server';
    return revealPassToastSuccessMessages;
  }

  if (eventPassNft?.isRevealed) {
    items.push({
      type: 'item',
      icon: <Download />,
      text: t('download-pass'),
      wrapper: (
        <Link
          href={`${getNextAppURL()}/api/downloadPass?id=${eventPassNft?.id}&tokenId=${eventPassNft?.tokenId}&slug=${event?.slug}-${slugify(
            eventPass?.name || '',
          )}`}
        />
      ),
      toastError: downloadPassToastError,
      toastSuccess: downloadPassToastSuccess,
    });
  } else {
    items.push({
      type: 'item',
      icon: <Reveal />,
      text: t('reveal-pass'),
      action: revealPass,
      toastError: revealPassToastError,
      toastSuccess: revealPassToastSuccess,
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
