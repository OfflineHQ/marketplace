import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import * as checkPass from '../../actions/checkEventPassFilesHash';
import * as deploy from '../../actions/deployEventPassCollectionWrapper';
import * as renameFiles from '../../actions/renameEventPassNftFiles';
import * as reveal from '../../actions/revealEventPassDelayedContract';

import {
  EventSheetExample,
  EventSheetSkeletonExample,
  eventWithDelayedPasses,
  eventWithNormalPasses,
} from './examples';

import { EventStatus_Enum } from '@gql/shared/types';
import { SessionDecorator } from '@test-utils/storybook-decorators';
import { mobileMode } from '@test-utils/storybook-modes';
import { getMock, render } from 'storybook-addon-module-mock';
import {
  eventPassNftFiles,
  eventPassNftFilesTableMocks,
} from '../../molecules/EventPassNftFilesTable/examples';
import { EventSheet } from './EventSheet';

const meta: Meta<typeof EventSheet> = {
  component: EventSheet,
  decorators: [SessionDecorator],
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: eventPassNftFilesTableMocks,
    },
  },
  render: EventSheetExample,
  args: {
    event: eventWithNormalPasses,
    organizerId: 'organizer-1',
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

export const WithDuplicateFiles: Story = {
  ...WithDelayedPasses,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ container, parameters }) => {
    const mock = getMock(parameters, checkPass, 'checkEventPassNftFilesHash');
    mock.mockReturnValue(
      Promise.resolve([
        [eventPassNftFiles[0].filePath, eventPassNftFiles[3].filePath],
      ]),
    );
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
        /Some of your files are duplicates, please remove them before deploying the contract/i,
      ),
    ).toBeInTheDocument();
  },
};

const eventPassWithEnoughFiles = {
  ...eventWithDelayedPasses,
  eventPasses: [
    {
      ...eventWithDelayedPasses.eventPasses[1],
      passAmount: {
        ...eventWithDelayedPasses.eventPasses[1].passAmount,
        maxAmount: 6,
      },
    },
  ],
};

export const WithClickOnDeploy: Story = {
  args: {
    event: eventPassWithEnoughFiles,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ container, parameters }) => {
    const mockRename = getMock(
      parameters,
      renameFiles,
      'renameEventPassNftFiles',
    );
    mockRename.mockReturnValue(Promise.resolve());
    const buttonElement = await screen.findByText(
      /Deploy the NFTs contract/i,
      {},
      {
        timeout: 5000,
      },
    );
    const mockDeploy = getMock(
      parameters,
      deploy,
      'deployEventPassCollectionWrapper',
    );
    await expect(buttonElement).toBeEnabled();
    await userEvent.click(buttonElement);
    expect(mockDeploy).toBeCalledTimes(1);
    const args = mockDeploy.mock.calls[0][0];
    expect(args).toMatchObject({
      signer: {},
      eventPassId: eventPassWithEnoughFiles.eventPasses[0].id,
      organizerId: 'organizer-1',
      eventId: eventPassWithEnoughFiles.id,
      eventSlug: eventPassWithEnoughFiles.slug,
    });
    expect(
      await screen.findByText(/successfully deployed/i),
    ).toBeInTheDocument();
    mockDeploy.mockRejectedValueOnce(new Error('error'));
    render(parameters);
    await expect(buttonElement).toBeEnabled();
    await userEvent.click(buttonElement);
    expect(await screen.findByText(/error during/i)).toBeInTheDocument();
  },
};

const eventPassWithPassToReveal = {
  ...eventWithDelayedPasses,
  eventPasses: [
    {
      ...eventWithDelayedPasses.eventPasses[0],
      eventPassNftContract: {
        ...eventWithDelayedPasses.eventPasses[0].eventPassNftContract,
        isDelayedRevealed: false,
      },
    },
  ],
};

export const WithEventPassDelayedRevealToReveal: Story = {
  args: {
    event: {
      ...eventPassWithPassToReveal,
      eventParameters: {
        status: EventStatus_Enum.Published,
      },
    },
  },
  play: async ({ container, parameters }) => {
    const textElement = await screen.findByText(/0xabcd/i);
    expect(textElement).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
    const buttonElement = await screen.findByText(/reveal your event pass/i);
    await expect(buttonElement).toBeEnabled();
    const revealMock = getMock(
      parameters,
      reveal,
      'revealEventPassDelayedContract',
    );
    await userEvent.click(buttonElement);
    const args = revealMock.mock.calls[0];
    expect(revealMock).toBeCalledTimes(1);
    expect(args[1]).toMatch(
      eventPassWithPassToReveal.eventPasses[0].eventPassNftContract
        ?.contractAddress as string,
    );
    expect(await screen.findByText(/has been revealed/i)).toBeInTheDocument();
    revealMock.mockRejectedValueOnce(new Error('error'));
    render(parameters);
    await expect(buttonElement).toBeEnabled();
    await userEvent.click(buttonElement);
    expect(await screen.findByText(/error during/i)).toBeInTheDocument();
  },
};

export const WithMobile: Story = {
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
};

export const Skeleton: Story = {
  render: () => <EventSheetSkeletonExample />,
};
