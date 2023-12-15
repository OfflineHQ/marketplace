import * as eventsApi from '@features/back-office/events-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { i18nUiTablesServerMocks } from '@test-utils/ui-mocks';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';

import {
  EventSheetExample,
  EventSheetSkeletonExample,
  eventWithDelayedPasses,
  eventWithNormalPasses,
} from './examples';

import { eventPassNftFiles } from '../../molecules/EventPassNftFilesTable/examples';
import { EventSheet } from './EventSheet';

const meta: Meta<typeof EventSheet> = {
  component: EventSheet,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(eventsApi, 'getEventPassNftFiles');
        mock.mockReturnValue(Promise.resolve(eventPassNftFiles));
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        return [mock, mockIntl, ...i18nUiTablesServerMocks()];
      },
    },
  },
  render: EventSheetExample,
  args: {
    event: eventWithNormalPasses,
  },
};

export default meta;

type Story = StoryObj<typeof EventSheet>;

export const Default: Story = {
  play: async ({ container }) => {
    const textElement = await screen.findByText(/0x1234/i);
    expect(textElement).toBeInTheDocument();

    const buttonElement = await screen.findByText(/Deploy the NFTs contract/i);
    await expect(buttonElement).toBeDisabled();
    expect(screen.getByText(/EpicFestVIP/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You need to define your sale parameters first/i),
    ).toBeInTheDocument();
    const saleParametersDropdowns =
      await screen.findAllByText(/Sale parameters/i);
    const saleParametersDropdown1 = saleParametersDropdowns[0];
    userEvent.click(saleParametersDropdown1);
    await expect(saleParametersDropdown1).toBeEnabled();
    expect(await screen.findByText(/100/i)).toBeInTheDocument();
    expect(await screen.findByText(/€425.00/i)).toBeInTheDocument();
    const saleParametersDropdown2 = saleParametersDropdowns[1];
    await expect(saleParametersDropdown2).toBeDisabled();
    const passAssociatedDropdowns = await screen.findAllByText(
      /Pass associated to your NFTs/i,
    );
    const passAssociatedDropdown1 = passAssociatedDropdowns[0];
    userEvent.click(passAssociatedDropdown1);
    await expect(passAssociatedDropdown1).toBeEnabled();
    const fileRow = await screen.findByText(/file1/i);
    expect(fileRow).toBeInTheDocument();
    const passAssociatedDropdown2 = passAssociatedDropdowns[1];
    await expect(passAssociatedDropdown2).toBeDisabled();
  },
};

export const WithDelayedPasses: Story = {
  args: {
    event: eventWithDelayedPasses,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/0xabcd/i);
    expect(textElement).toBeInTheDocument();
    const saleParametersDropdowns =
      await screen.findAllByText(/Sale parameters/i);
    const saleParametersDropdown1 = saleParametersDropdowns[0];
    await expect(saleParametersDropdown1).toBeEnabled();
    const saleParametersDropdown2 = saleParametersDropdowns[1];
    await expect(saleParametersDropdown2).toBeEnabled();

    const passAssociatedDropdowns = await screen.findAllByText(
      /Pass associated to your NFTs/i,
    );
    const passAssociatedDropdown1 = passAssociatedDropdowns[0];
    await expect(passAssociatedDropdown1).toBeEnabled();
    const passAssociatedDropdown2 = passAssociatedDropdowns[1];
    await expect(passAssociatedDropdown2).toBeEnabled();
    expect(screen.getByText(/DelayedEventVIP/i)).toBeInTheDocument();
    const buttonElement = await screen.findByText(
      /Deploy the NFTs contract/i,
      {},
      {
        timeout: 5000,
      },
    );
    await expect(buttonElement).toBeDisabled();
    expect(
      screen.getByText(
        /The number of files uploaded for your pass doesn't match the number of pass you intend to mint/i,
      ),
    ).toBeInTheDocument();
  },
};

export const WithMobile: Story = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Skeleton: Story = {
  render: () => <EventSheetSkeletonExample />,
};
