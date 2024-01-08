import * as authProvider from '@next/auth';
import * as uploaderProvider from '@next/uploader-provider';
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import * as nextIntl from 'next-intl';
import * as checkPass from '../../actions/checkEventPassFilesHash';
import * as deleteFile from '../../actions/deleteEventPassFile';
import * as getPass from '../../actions/getEventPassNftFiles';

import { screen, userEvent, waitFor, within } from '@storybook/test';
import { i18nUiTablesServerMocks } from '@test-utils/ui-mocks';
import { sleep } from '@utils';
import { createMock, getMock } from 'storybook-addon-module-mock';
import { EventPassNftFilesTable } from './EventPassNftFilesTable';
import {
  eventPassNftFiles,
  eventPassNftVIPWithContract,
  eventPassNftVipNoContractDelayedReveal,
} from './examples';

const meta = {
  component: EventPassNftFilesTable,
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
        const mockAuth = createMock(authProvider, 'useAuthContext');
        mockAuth.mockReturnValue({
          safeUser: {
            eoa: '0x123',
          },
        });
        const mockDeleteFile = createMock(deleteFile, 'deleteEventPassFile');
        mockDeleteFile.mockImplementation(async () => {
          await sleep(300);
          return Promise.resolve();
        });
        const mockCheckPass = createMock(
          checkPass,
          'checkEventPassNftFilesHash',
        );
        mockCheckPass.mockReturnValue(Promise.resolve([]));
        return [
          mock,
          mockIntl,
          mockUploader,
          mockAuth,
          mockAuth,
          mockDeleteFile,
          mockCheckPass,
          ...i18nUiTablesServerMocks(),
        ];
      },
    },
  },
  render: (props) => (
    <div className="distinct bg-distinct p-6">
      <EventPassNftFilesTable {...props} className="pb-8" />
    </div>
  ),
} satisfies Meta<typeof EventPassNftFilesTable>;

export default meta;

type Story = StoryObj<typeof meta>;

const openButtonFileRow = async (fileRow: HTMLElement) => {
  let buttonFileRow = within(fileRow.closest('tr') as HTMLElement).queryByRole(
    'button',
  );
  while (buttonFileRow && buttonFileRow.getAttribute('data-state') !== 'open') {
    await userEvent.click(buttonFileRow);
    buttonFileRow = within(fileRow.closest('tr') as HTMLElement).queryByRole(
      'button',
    );
  }
};

export const Default: Story = {
  args: {
    organizerId: 'organizerId',
    eventId: 'eventId',
    eventPassId: 'eventPassId',
    eventSlug: 'eventSlug',
    eventPass: eventPassNftVipNoContractDelayedReveal,
  },
};

export const WithFileSelectedAndActions: Story = {
  ...Default,
  play: async ({ canvasElement, parameters }) => {
    const file1 = await screen.findByText(/file1/i);
    const fileRow = file1.closest('tr') as HTMLElement;

    await openButtonFileRow(fileRow);
    expect(await screen.findByText(/Download the file/i)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/Delete the file/i));
    await screen.findByRole('status');
    const mock = getMock(parameters, deleteFile, 'deleteEventPassFile');
    expect(mock).toHaveBeenCalledWith({
      organizerId: 'organizerId',
      eventId: 'eventId',
      eventPassId: 'eventPassId',
      filePath: '/local/path/to/file1',
    });
    const fileCheckbox = within(fileRow).getByRole('checkbox');
    await userEvent.click(fileCheckbox);
    const file3 = await screen.findByText(/file3/i);
    const fileRow3 = file3.closest('tr') as HTMLElement;
    const fileCheckbox3 = within(fileRow3).getByRole('checkbox');
    await userEvent.click(fileCheckbox3);
    userEvent.click(
      await screen.findByRole('button', {
        name: /Menu Actions/i,
      }),
    );
    expect(await screen.findByText(/delete/i)).toBeInTheDocument();
    expect(await screen.findByText(/download/i)).toBeInTheDocument();
  },
};

export const WithNoFiles: Story = {
  ...Default,
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(parameters, getPass, 'getEventPassNftFiles');
    mock.mockReturnValue(Promise.resolve([]));
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /upload your files/i }),
      ).toBeInTheDocument();
    });
  },
};

export const WithNoFilesUploadModale: Story = {
  ...Default,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(parameters, getPass, 'getEventPassNftFiles');
    mock.mockReturnValue(Promise.resolve([]));
    userEvent.click(
      await screen.findByRole('button', { name: /upload your files/i }),
    );
    expect(await screen.findByText(/Upload an image/i)).toBeInTheDocument();
  },
};

export const WithEventPassNftContract: Story = {
  ...Default,
  args: {
    ...Default.args,
    eventPass: eventPassNftVIPWithContract,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement, parameters }) => {
    const file4 = await screen.findByText(/file4/i);
    const fileRow = file4.closest('tr') as HTMLElement;
    await openButtonFileRow(fileRow);
    expect(await screen.findByText(/show the file/i)).toBeInTheDocument();
    expect(screen.queryByText(/delete the file/i)).toBeNull();
    userEvent.click(await screen.findByText(/Download the file/i));
    //todo check arg of mock download
    await userEvent.click(
      await screen.findByRole('checkbox', { name: /select all/i }),
    );
    userEvent.click(
      await screen.findByRole('button', {
        name: /Menu Actions/i,
      }),
    );
    expect(await screen.findByText(/download/i)).toBeInTheDocument();
    // expect(screen.queryByText(/delete/i)).toBeNull();
    userEvent.click(await screen.findByText(/download/i));
    //todo check arg of mock download
  },
};

export const WithEventPassNftContractAndNoFiles: Story = {
  ...WithEventPassNftContract,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(parameters, getPass, 'getEventPassNftFiles');
    mock.mockReturnValue(Promise.resolve([]));
    expect(await screen.findByText(/No results/i)).toBeInTheDocument();
  },
};

export const WithDuplicatedFiles: Story = {
  ...Default,
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(parameters, checkPass, 'checkEventPassNftFilesHash');
    mock.mockReturnValue(
      Promise.resolve([
        [eventPassNftFiles[0].filePath, eventPassNftFiles[3].filePath],
        [
          eventPassNftFiles[1].filePath,
          eventPassNftFiles[2].filePath,
          eventPassNftFiles[5].filePath,
        ],
      ]),
    );
    expect(await screen.findByText(/duplicates/i)).toBeInTheDocument();
    userEvent.click(
      await screen.findByRole('button', {
        name: /Menu Actions/i,
      }),
    );
    expect(await screen.findByText(/delete/i)).toBeInTheDocument();
  },
};
