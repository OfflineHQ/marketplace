'use client';

import { Locale, interpolateString } from '@next/i18n';
import { OffKeyState } from '@next/iframe';
import { AutoAnimate, Text, TextSkeleton } from '@ui/components';
import { OffKeyInfo, OffKeyInfoSkeleton } from '../OffKeyInfo/OffKeyInfo';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';

export interface OffKeyGateProps {
  className?: string;
  organizerId: string;
  locale: Locale;
  textGate: {
    subtitle: {
      [OffKeyState.Unlocked]: string;
      [OffKeyState.Unlocking]: string;
      [OffKeyState.Used]: string;
      [OffKeyState.Locked]: string;
    };
    mainText: {
      [OffKeyState.Unlocked]: string;
      [OffKeyState.Unlocking]: string;
      [OffKeyState.Used]: string;
      [OffKeyState.Locked]: string;
    };
    key: {
      statusText: {
        [OffKeyState.Unlocked]: string;
        [OffKeyState.Unlocking]: string;
        [OffKeyState.Used]: string;
        [OffKeyState.Locked]: string;
      };
      name: string;
    };
  };
}

export default function OffKeyGate({
  className,
  organizerId,
  locale,
  textGate,
}: OffKeyGateProps) {
  const { offKeyState, customer } = useShopifyCustomer({ organizerId });
  const textsSubtitle = {
    [OffKeyState.Unlocked]: interpolateString(
      textGate.subtitle[OffKeyState.Unlocked],
      locale,
      customer,
    ),
    [OffKeyState.Unlocking]: interpolateString(
      textGate.subtitle[OffKeyState.Unlocking],
      locale,
      customer,
    ),
    [OffKeyState.Used]: interpolateString(
      textGate.subtitle[OffKeyState.Used],
      locale,
      customer,
    ),
    [OffKeyState.Locked]: interpolateString(
      textGate.subtitle[OffKeyState.Locked],
      locale,
      customer,
    ),
  };
  const textsMainText = {
    [OffKeyState.Unlocked]: interpolateString(
      textGate.mainText[OffKeyState.Unlocked],
      locale,
      customer,
    ),
    [OffKeyState.Unlocking]: interpolateString(
      textGate.mainText[OffKeyState.Unlocking],
      locale,
      customer,
    ),
    [OffKeyState.Used]: interpolateString(
      textGate.mainText[OffKeyState.Used],
      locale,
      customer,
    ),
    [OffKeyState.Locked]: interpolateString(
      textGate.mainText[OffKeyState.Locked],
      locale,
      customer,
    ),
  };
  const textsKeyStatus = {
    [OffKeyState.Unlocked]: textGate.key.statusText[OffKeyState.Unlocked],
    [OffKeyState.Unlocking]: textGate.key.statusText[OffKeyState.Unlocking],
    [OffKeyState.Used]: textGate.key.statusText[OffKeyState.Used],
    [OffKeyState.Locked]: textGate.key.statusText[OffKeyState.Locked],
  };
  const gateName = interpolateString(textGate.key.name, locale, customer);
  return (
    <AutoAnimate>
      {offKeyState && customer ? (
        <div className={`flex flex-col justify-between space-y-2 ${className}`}>
          <div className="flex flex-col space-y-2 px-2">
            <Text variant="h6">{textsSubtitle[offKeyState]}</Text>
            <Text variant="p">{textsMainText[offKeyState]}</Text>
            {/* {gateState === OffKeyState.Locked && <OffKeyHowToGet />} */}
          </div>
          <div className="flex flex-col justify-end">
            <OffKeyInfo
              offKeyStatusText={textsKeyStatus[offKeyState] as string}
              state={offKeyState}
              offKeyName={gateName as string}
            />
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
