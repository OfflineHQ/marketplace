import { Text, TextSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { OffKeyInfo, OffKeyInfoSkeleton } from '../OffKeyInfo/OffKeyInfo';
import { OffKeyState } from '../types';

export interface OffKeyGateProps {
  initialGateState: OffKeyState;
  gateId: string;
  address: string;
  className?: string;
}

export function OffKeyGate(props: OffKeyGateProps) {
  return (
    <Suspense fallback={<OffKeyGateSkeleton />}>
      <OffKeyGateContent {...props} />
    </Suspense>
  );
}

export function OffKeyGateContent({
  gateId,
  address,
  className,
  initialGateState,
}: OffKeyGateProps) {
  const t = useTranslations('Shopify.OffKeyGate');
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
    <div className={`flex flex-col justify-between space-y-2 ${className}`}>
      <div className="flex flex-col space-y-2 px-2">
        <Text variant="h6">{stateToSubtitle[initialGateState]}</Text>
        <Text variant="p">{stateToMainText[initialGateState]}</Text>
        {/* {gateState === OffKeyState.Locked && <OffKeyHowToGet />} */}
      </div>
      <div className="flex flex-col justify-end">
        <OffKeyInfo state={initialGateState} offKeyName={offKeyName} />
      </div>
    </div>
  );
}

export function OffKeyGateSkeleton() {
  return (
    <div className="flex-col space-y-2">
      <TextSkeleton variant="h6" />
      <TextSkeleton variant="p" />
      <OffKeyInfoSkeleton />
    </div>
  );
}
