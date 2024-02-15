import * as uploaderProvider from '@next/uploader-provider';
import * as walletProvider from '@next/wallet';
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import * as nextIntl from 'next-intl';
import * as getPass from '../../actions/getEventPassNftFiles';

import { screen, userEvent } from '@storybook/test';
import { SessionDecorator } from '@test-utils/storybook';
import { createMock, getMock } from 'storybook-addon-module-mock';
import {
  eventPassNftFiles,
  eventPassNftVIPWithContract,
} from '../EventPassNftFilesTable/examples';
import { EventPassFilesUploader } from './EventPassFilesUploader';

const meta = {
  component: EventPassFilesUploader,
  decorators: [SessionDecorator],
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(getPass, 'getEventPassNftFiles');
        mock.mockReturnValue(Promise.resolve(eventPassNftFiles));
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        const mockUploader = createMock(uploaderProvider, 'useUploader');
        mockUploader.mockReturnValue({ sessionReady: true });
        const mockWallet = createMock(walletProvider, 'useWalletContext');
        mockWallet.mockReturnValue({
          provider: {
            getSigner: () => Promise.resolve({}),
          },
        });

        return [mock, mockIntl, mockUploader, mockWallet];
      },
    },
  },
} satisfies Meta<typeof EventPassFilesUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    organizerId: 'organizerId',
    eventId: 'eventId',
    eventPassId: 'eventPassId',
    eventSlug: 'eventSlug',
    eventPass: eventPassNftVIPWithContract,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByRole('button', { name: /upload/i }));
    expect(await screen.findByText(/Upload an image/i)).toBeInTheDocument();
  },
};

export const Skeleton: Story = {
  ...Default,
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(parameters, uploaderProvider, 'useUploader');
    mock.mockReturnValue({ sessionReady: false });
    userEvent.click(await screen.findByRole('button', { name: /upload/i }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.queryByText(/Upload an image/i)).not.toBeInTheDocument();
  },
};

export const Disabled: Story = {
  ...Default,
  args: {
    eventPass: {
      ...eventPassNftVIPWithContract,
      passAmount: {
        ...eventPassNftVIPWithContract.passAmount,
        maxAmount: 0,
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(
      await screen.findByText(
        /You have reached the maximum number of files for your pass/i,
      ),
    ).toBeInTheDocument();
  },
};
