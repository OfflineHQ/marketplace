import * as iframeApi from '@next/iframe';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import {
  OffKeyProfileExample,
  offKeyProfileProps,
} from '../OffKeyProfile/examples';
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

export const offKeyHeaderConnectedProps: Omit<
  OffKeyHeaderConnectedProps,
  'profile' | 'viewType'
> = {
  locale: 'en',
  textHeaderConnected: {
    default: 'Welcome {firstName}!',
    howToGet: 'How to get the key',
  },
  organizerId: 'organizerId',
};

export const OffKeyHeaderConnectedExamples = (
  props: Omit<OffKeyHeaderConnectedProps, 'profile'>,
) => {
  return (
    <OffKeyHeaderConnected
      {...props}
      profile={<OffKeyProfileExample {...offKeyProfileProps} />}
    />
  );
};
