import { IFrameProvider, OffKeyState } from '@next/iframe';
import React from 'react';
import {
  OffKeyHeaderConnectedExamples,
  offKeyHeaderConnectedProps,
} from '../OffKeyHeaderConnected/examples';
import { OffKeyLayout } from '../OffKeyLayout/OffKeyLayout';
import { OffKeyViewHeaderConnected } from '../types';
import OffKeyGate, { OffKeyGateProps } from './OffKeyGate';

export const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

export const offKeyGateProps: OffKeyGateProps = {
  organizerId: '1',
  locale: 'en',
  textGate: {
    subtitle: {
      [OffKeyState.Unlocked]: '🎉 Congratulations',
      [OffKeyState.Unlocking]: 'Creating your key',
      [OffKeyState.Used]: 'Key already used',
      [OffKeyState.Locked]: "🙁 Sorry you don't have access",
    },
    mainText: {
      [OffKeyState.Unlocked]:
        'You have unlocked this item and can now add it to your cart.',
      [OffKeyState.Unlocking]:
        'Your key is being created and will be ready in a few seconds.',
      [OffKeyState.Used]:
        "Unfortunately your key has already been used so you can't proceed with the purchase of this item",
      [OffKeyState.Locked]:
        'Unfortunately as of now you do not have access to the key to unlock this product. Check out how to get the key and proceed with the purchase.',
    },
    key: {
      statusText: {
        [OffKeyState.Unlocked]: 'Unlocked',
        [OffKeyState.Unlocking]: 'Unlocking',
        [OffKeyState.Used]: 'Used',
        [OffKeyState.Locked]: 'Locked',
      },
      name: 'OffKey',
    },
  },
};

export function OffKeyGateDemo(props: OffKeyGateProps) {
  return (
    <IFrameProvider>
      <OffKeyLayout
        header={
          <OffKeyHeaderConnectedExamples
            viewType={OffKeyViewHeaderConnected.Default}
            {...offKeyHeaderConnectedProps}
          />
        }
      >
        <OffKeyGate className="flex-1 pt-2" {...props} />
      </OffKeyLayout>
    </IFrameProvider>
  );
}
