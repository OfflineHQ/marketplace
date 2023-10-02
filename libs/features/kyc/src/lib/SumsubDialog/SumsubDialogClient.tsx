'use client';

import { handleApplicantStatusChanged } from '@features/kyc-actions';
import { KycStatus_Enum } from '@gql/shared/types';
import { PropsFrom } from '@next/types';
import SumsubWebSdk from '@sumsub/websdk-react';
import {
  AnyEventPayload,
  ErrorHandler,
  MessageHandler,
} from '@sumsub/websdk/types/types';
import { AutoAnimate, Button, ButtonProps, DialogFooter } from '@ui/components';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link, { LinkProps } from 'next/link';
import { useState } from 'react';
type MessageType = Parameters<MessageHandler>[0];
type Error = Parameters<ErrorHandler>[0];

export interface SumsubWebSdkProps
  extends Omit<PropsFrom<SumsubWebSdk>, 'onMessage' | 'onError'> {
  confirmedText: string;
  confirmedLink: LinkProps;
  confirmedIcon: ButtonProps['icon'];
}

export const SumsubDialogClient: React.FC<SumsubWebSdkProps> = ({
  accessToken,
  expirationHandler,
  config,
  options,
  confirmedIcon,
  confirmedText,
  confirmedLink,
}) => {
  const { update } = useSession();
  const { resolvedTheme } = useTheme();
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  async function onMessage(type: MessageType, payload: AnyEventPayload) {
    console.log({ type, payload });
    if (
      type === 'idCheck.onApplicantStatusChanged' &&
      'reviewStatus' in payload
    ) {
      const status = payload.reviewStatus as KycStatus_Enum;
      console.log({ status });
      const statusDifferent = await handleApplicantStatusChanged(status);
      if (status === KycStatus_Enum.Completed) {
        setStatusConfirmed(true);
      }
      if (statusDifferent) update();
    }
  }
  function onError(error: Error) {
    console.error({ error });
  }
  return (
    <>
      <SumsubWebSdk
        accessToken={accessToken}
        expirationHandler={expirationHandler}
        config={{ ...config, theme: resolvedTheme }}
        options={options}
        onMessage={onMessage}
        onError={onError}
      />
      <AutoAnimate className="mt-auto">
        {statusConfirmed ? (
          <DialogFooter>
            <Link legacyBehavior passHref {...confirmedLink}>
              <Button className={`w-full`} block icon={confirmedIcon}>
                {confirmedText}
              </Button>
            </Link>
          </DialogFooter>
        ) : null}
      </AutoAnimate>
    </>
  );
};
