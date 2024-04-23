'use client';

import { OffKeyState, useIframeOffKey } from '@next/iframe';
import { AutoAnimate, Text, TextSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { OffKeyInfo, OffKeyInfoSkeleton } from '../OffKeyInfo/OffKeyInfo';

export interface OffKeyGateProps {
  gateId: string;
  address: string;
  className?: string;
}

export default function OffKeyGate({
  gateId,
  address,
  className,
}: OffKeyGateProps) {
  const t = useTranslations('Shopify.OffKeyGate');
  const { offKeyState } = useIframeOffKey();
  const stateToSubtitle = {
    [OffKeyState.Unlocked]: t('unlocked-subtitle'),
    [OffKeyState.Unlocking]: t('unlocking-subtitle'),
    [OffKeyState.Used]: t('used-subtitle'),
    [OffKeyState.Locked]: t('locked-subtitle'),
  };
  const stateToMainText = {
    [OffKeyState.Unlocked]: t('unlocked-text'),
    [OffKeyState.Unlocking]: t('unlocking-text'),
    [OffKeyState.Used]: t('used-text'),
    [OffKeyState.Locked]: t('locked-text'),
  };
  const offKeyName = t('off-key-name');
  return (
    <AutoAnimate>
      {offKeyState ? (
        <div className={`flex flex-col justify-between space-y-2 ${className}`}>
          <div className="flex flex-col space-y-2 px-2">
            <Text variant="h6">{stateToSubtitle[offKeyState]}</Text>
            <Text variant="p">{stateToMainText[offKeyState]}</Text>
            {/* {gateState === OffKeyState.Locked && <OffKeyHowToGet />} */}
          </div>
          <div className="flex flex-col justify-end">
            <OffKeyInfo state={offKeyState} offKeyName={offKeyName} />
          </div>
        </div>
      ) : (
        <OffKeyGateSkeleton className={className} />
      )}
    </AutoAnimate>
  );
}

export function OffKeyGateSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-between space-y-4 ${className}`}>
      <div className="flex flex-col space-y-4 px-2">
        <TextSkeleton variant="h6" />
        <TextSkeleton variant="p" />
      </div>
      <div className="flex flex-col justify-end">
        <OffKeyInfoSkeleton />
      </div>
    </div>
  );
}
