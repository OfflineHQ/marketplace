import * as loyaltyCardApi from '@features/back-office/loyalty-card-api';
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { ToasterDecorator } from '@test-utils/storybook-decorators';
import { getMock } from 'storybook-addon-module-mock';
import { loyaltyCardFooterMocks } from '../../molecules/LoyaltyCardFooter/examples';
import { loyaltyCardNftsPasswordTableMocks } from '../../molecules/LoyaltyCardNftsPasswordsTable/examples';
import { LoyaltyCardPage } from './LoyaltyCardPage';
import { LoyaltyCardPageDemo, loyaltyCard } from './examples';

const meta: Meta<typeof LoyaltyCardPage> = {
  component: LoyaltyCardPage,
  render: LoyaltyCardPageDemo,
  decorators: [ToasterDecorator],
  args: {
    loyaltyCard,
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/loyalty-card',
      },
    },
    moduleMock: {
      mock: () => [
        ...loyaltyCardNftsPasswordTableMocks(),
        ...loyaltyCardFooterMocks(),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoyaltyCardPage>;

export const NotDeployed: Story = {};

export const Deployed: Story = {
  args: {
    loyaltyCard: {
      ...loyaltyCard,
      loyaltyCardNftContract: {
        contractAddress: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
        chainId: '1',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      await screen.findByRole('button', {
        name: /'One time codes' associated to your NFTs/i,
      }),
    );
    await screen.findByText(/0x1234567890abcdef/i);
  },
};

export const DeployedNoPasswords: Story = {
  ...Deployed,
  play: async ({ canvasElement, parameters }) => {
    const mock = getMock(
      parameters,
      loyaltyCardApi,
      'getNftMintPasswordsForContract',
    );
    mock.mockResolvedValue([]);
    await userEvent.click(
      await screen.findByRole('button', {
        name: /'One time codes' associated to your NFTs/i,
      }),
    );
    await screen.findByText(/No 'One Time Codes' added yet/i);
    userEvent.click(
      await screen.findByRole('button', {
        name: /Create 'One Time Codes'/i,
      }),
    );
  },
};
