import * as iframeApi from '@next/iframe';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import { OffKeyProfileExample } from '../OffKeyProfile/examples';
import OffKeyHeaderConnected, {
  OffKeyHeaderConnectedProps,
} from './OffKeyHeaderConnected';

export function iframeOffKeyMocks(
  props: ReturnType<typeof iframeApi.useIframeOffKey>,
) {
  const useIframeOffKeyMock = createMock(iframeApi, 'useIframeOffKey');
  useIframeOffKeyMock.mockReturnValue(props);
  return useIframeOffKeyMock;
}

export const OffKeyHeaderConnectedExamples = (
  props: Omit<OffKeyHeaderConnectedProps, 'profile'>,
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
