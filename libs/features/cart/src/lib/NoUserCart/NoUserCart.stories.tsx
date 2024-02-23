import * as cartApi from '@features/cart-api';
import * as authProvider from '@next/auth';
import { StoryObj, type Meta } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { mobileMode } from '@test-utils/storybook-modes';
import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { NoUserCart } from './NoUserCart';
import { NoUserCartExample, allPassesCart } from './examples';

const meta: Meta<typeof NoUserCart> = {
  component: NoUserCart,
  render: NoUserCartExample,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(cartApi, 'getEventWithPasses');
        mock.mockImplementation(({ eventSlug, locale }) => {
          return Promise.resolve(
            eventCart1Props.slug === eventSlug
              ? eventCart1Props
              : eventCart2Props,
          );
        });
        const mockAuth = createMock(authProvider, 'useAuthContext');
        mockAuth.mockImplementation(() => ({
          login: () => Promise.resolve(),
          logout: () => Promise.resolve(),
          createAccount: () => Promise.resolve(),
          isReady: true,
          connecting: false,
        }));
        return [mock, mockAuth];
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoUserCart>;

export const SectionWithNoUserNoCart: Story = {
  play: async (context) => {
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /World Cup/i,
      }),
    ).toBeNull();
    await screen.findByText(/You don't have anything in your cart yet/i);
  },
};

export const SectionWithNoUserNoCartMobile: Story = {
  parameters: {
    ...mobileMode,
  },
  ...SectionWithNoUserNoCart,
};

export const SectionWithNoUserWithPasses: Story = {
  args: {
    allPassesCart,
  },
  play: async (context) => {
    await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    await screen.findByRole('button', {
      name: /World Cup/i,
    });
  },
};

export const SectionWithNoUserWithPassesMobile: Story = {
  parameters: {
    ...mobileMode,
  },
  ...SectionWithNoUserWithPasses,
};

export const SectionWithNoUserLoading: Story = {
  play: async (context) => {
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /World Cup/i,
      }),
    ).toBeNull();
    await screen.findByText(/Loading/i);
  },
};
