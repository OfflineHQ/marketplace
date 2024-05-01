'use client';

import { Locale, interpolateString } from '@next/i18n';
import { OffKeyState } from '@next/iframe';
import { AutoAnimate, Text } from '@ui/components';
import { OffKeyInfo } from '../OffKeyInfo/OffKeyInfo';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { OffKeyGateSkeleton } from './OffKeyGateSkeleton';

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
  const { offKeyState, customer, shopifyContext } = useShopifyCustomer({
    organizerId,
  });
  const textsSubtitle = {
    [OffKeyState.Unlocked]: interpolateString(
      textGate.subtitle[OffKeyState.Unlocked],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Unlocking]: interpolateString(
      textGate.subtitle[OffKeyState.Unlocking],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Used]: interpolateString(
      textGate.subtitle[OffKeyState.Used],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Locked]: interpolateString(
      textGate.subtitle[OffKeyState.Locked],
      locale,
      shopifyContext,
    ),
  };
  const textsMainText = {
    [OffKeyState.Unlocked]: interpolateString(
      textGate.mainText[OffKeyState.Unlocked],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Unlocking]: interpolateString(
      textGate.mainText[OffKeyState.Unlocking],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Used]: interpolateString(
      textGate.mainText[OffKeyState.Used],
      locale,
      shopifyContext,
    ),
    [OffKeyState.Locked]: interpolateString(
      textGate.mainText[OffKeyState.Locked],
      locale,
      shopifyContext,
    ),
  };
  const textsKeyStatus = {
    [OffKeyState.Unlocked]: textGate.key.statusText[OffKeyState.Unlocked],
    [OffKeyState.Unlocking]: textGate.key.statusText[OffKeyState.Unlocking],
    [OffKeyState.Used]: textGate.key.statusText[OffKeyState.Used],
    [OffKeyState.Locked]: textGate.key.statusText[OffKeyState.Locked],
  };
  const gateName = interpolateString(textGate.key.name, locale, shopifyContext);
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
