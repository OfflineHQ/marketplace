import * as kycApi from '@features/kyc-actions';
import { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { ReactQueryDecorator, SessionDecorator } from '@test-utils/storybook';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import { SumsubButton } from './SumsubButton';

const meta = {
  component: SumsubButton,
  decorators: [SessionDecorator, ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => {
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        const mockKyc = createMock(kycApi, 'initKyc');
        mockKyc.mockReturnValue({
          user: {},
          accessToken: 'accessToken',
        });
        return [mockIntl, mockKyc];
      },
    },
  },
} as Meta<typeof SumsubButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /verify your email/i,
      }),
    );
    expect(await screen.findByRole('dialog')).toBeTruthy();
  },
};
