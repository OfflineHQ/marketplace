import React from 'react';
import { OffKeyProfileExample } from '../OffKeyProfile/examples';
import {
  OffKeyHeaderConnected,
  OffKeyHeaderConnectedProps,
} from './OffKeyHeaderConnected';

export const OffKeyHeaderConnectedExamples = (
  props: OffKeyHeaderConnectedProps,
) => {
  return (
    <OffKeyHeaderConnected
      {...props}
      profile={
        <OffKeyProfileExample
          user={{
            id: '1',
            address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
          }}
        />
      }
    />
  );
};
