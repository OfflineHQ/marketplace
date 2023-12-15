import * as eventsApi from '@features/back-office/events-api';
import * as authProvider from '@next/auth';
import * as uploaderProvider from '@next/uploader-provider';
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import * as nextIntl from 'next-intl';

import { screen, userEvent } from '@storybook/test';
import { createMock, getMock } from 'storybook-addon-module-mock';
import {
  eventPassNftFiles,
  eventPassNftVIPWithContract,
} from '../EventPassNftFilesTable/examples';
import { EventPassFilesUploader } from './EventPassFilesUploader';

const meta = {
  component: EventPassFilesUploader,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(eventsApi, 'getEventPassNftFiles');
        mock.mockReturnValue(Promise.resolve(eventPassNftFiles));
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        const mockUploader = createMock(uploaderProvider, 'useUploader');
        mockUploader.mockReturnValue({ sessionReady: true });
        const mockAuth = createMock(authProvider, 'useAuthContext');
        mockAuth.mockReturnValue({
          safeUser: {
            eoa: '0x123',
          },
        });
        return [mock, mockIntl, mockUploader, mockAuth, mockAuth];
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
