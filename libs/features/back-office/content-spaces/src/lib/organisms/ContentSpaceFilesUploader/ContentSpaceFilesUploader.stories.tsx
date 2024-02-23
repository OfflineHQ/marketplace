import * as uploaderProvider from '@next/uploader-provider';
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import * as nextIntl from 'next-intl';
import * as getPass from '../../actions/getContentSpaceFiles';

import * as walletProvider from '@next/wallet';
import { screen, userEvent } from '@storybook/test';
import { SessionDecorator } from '@test-utils/storybook-decorators';
import { createMock, getMock } from 'storybook-addon-module-mock';
import { contentSpaceFiles } from '../ContentSpaceFilesTable/examples';
import { ContentSpaceFilesUploader } from './ContentSpaceFilesUploader';

const meta = {
  component: ContentSpaceFilesUploader,
  decorators: [SessionDecorator],
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(getPass, 'getContentSpaceFiles');
        mock.mockReturnValue(Promise.resolve(contentSpaceFiles));
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
} satisfies Meta<typeof ContentSpaceFilesUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    organizerId: 'organizerId',
    contentSpaceId: 'contentSpaceId',
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

// export const Disabled: Story = {
//   ...Default,
//   args: {
//     eventPass: {
//       ...eventPassNftVIPWithContract,
//       passAmount: {
//         ...eventPassNftVIPWithContract.passAmount,
//         maxAmount: 0,
//       },
//     },
//   },
//   play: async ({ canvasElement }) => {
//     expect(
//       await screen.findByText(
//         /You have reached the maximum number of files for your pass/i,
//       ),
//     ).toBeInTheDocument();
//   },
// };
