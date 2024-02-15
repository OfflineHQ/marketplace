'use client';

import { handleApplicantStatusChanged } from '@features/kyc-actions';
import { getSumSubAccessToken } from '@features/kyc-api';
import { KycStatus_Enum, Locale } from '@gql/shared/types';
import { Link, useRouter } from '@next/navigation';
import { PropsFrom } from '@next/types';
import SumsubWebSdk from '@sumsub/websdk-react';
import {
  AnyEventPayload,
  ErrorHandler,
  MessageHandler,
} from '@sumsub/websdk/types/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  AutoAnimate,
  Button,
  ButtonProps,
  DialogClose,
  DialogContentSkeleton,
  DialogFooter,
} from '@ui/components';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { initKyc } from '../actions/initKyc';
type MessageType = Parameters<MessageHandler>[0];
type Error = Parameters<ErrorHandler>[0];

export interface SumsubWebSdkProps
  extends Omit<
    PropsFrom<SumsubWebSdk>,
    'onMessage' | 'onError' | 'accessToken' | 'expirationHandler'
  > {
  confirmedText: string;
  confirmedLink?: PropsFrom<typeof Link>;
  confirmedIcon?: ButtonProps['icon'];
  locale: Locale;
}

export const SumsubDialogClient: React.FC<SumsubWebSdkProps> = ({
  config,
  options,
  confirmedIcon,
  confirmedText,
  confirmedLink,
  locale,
}) => {
  const router = useRouter();
  const { data: accessToken, isFetching } = useSuspenseQuery({
    queryKey: ['accessToken', locale],
    queryFn: async () => {
      const res = await initKyc(locale);
      if (!res || !res.user) throw new Error('User not found');
      return res.accessToken;
    },
    refetchOnWindowFocus: false,
  });
  const { update } = useSession();
  const { resolvedTheme } = useTheme();
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  async function onMessage(type: MessageType, payload: AnyEventPayload) {
    if (
      type === 'idCheck.onApplicantStatusChanged' &&
      'reviewStatus' in payload
    ) {
      const status = payload.reviewStatus as KycStatus_Enum;
      console.log({ status });
      await handleApplicantStatusChanged(status);
      if (status === KycStatus_Enum.Completed) {
        setStatusConfirmed(true);
        await update();
        router.refresh();
      }
    }
  }
  function onError(error: Error) {
    console.error({ error });
  }
  return !isFetching && accessToken ? (
    <>
      <SumsubWebSdk
        accessToken={accessToken}
        expirationHandler={getSumSubAccessToken}
        config={{ ...config, lang: locale, theme: resolvedTheme }}
        options={options}
        onMessage={onMessage}
        onError={onError}
      />
      <AutoAnimate className="mt-auto">
        {statusConfirmed ? (
          <DialogFooter>
            {confirmedLink ? (
              <Link legacyBehavior passHref {...confirmedLink}>
                <Button className={`w-full`} block icon={confirmedIcon}>
                  {confirmedText}
                </Button>
              </Link>
            ) : (
              <DialogClose asChild>
                <Button className={`w-full`} block icon={confirmedIcon}>
                  {confirmedText}
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        ) : null}
      </AutoAnimate>
    </>
  ) : (
    <DialogContentSkeleton />
  );
};
