import { Meta, StoryObj } from '@storybook/react';
import { graphql } from 'msw';
import { OrganizerSection } from '../OrganizerSection/OrganizerSection';
import {
  OrganizerPageDemo,
  OrganizerPageSkeleton,
  OrganizerPageWithEventsDemo,
  organizer,
  organizer2,
} from './examples';

const meta = {
  component: OrganizerSection,
  render: OrganizerPageDemo,
  args: {
    ...organizer,
  },
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        graphql.query('CheckFollowingOrganizer', (req, res, ctx) => {
          return ctx.data({
            follow_by_pk: null,
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof OrganizerSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLongNameSocialLinksAndEvents: Story = {
  args: {
    ...organizer2,
  },
  render: OrganizerPageWithEventsDemo,
};

export const Dark: Story = {
  ...WithLongNameSocialLinksAndEvents,
  parameters: {
    darkMode: {
      isDark: true,
    },
    layout: 'fullscreen',
  },
};

export const Mobile: Story = {
  ...WithLongNameSocialLinksAndEvents,
  parameters: {
    viewport: {
      defaultViewport: 'small_mobile',
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: 'small_mobile',
        },
      },
    },
  },
};

export const Skeleton: Story = {
  render: OrganizerPageSkeleton,
};

export const SkeletonMobile: Story = {
  ...Skeleton,
  parameters: {
    viewport: {
      defaultViewport: 'small_mobile',
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: 'small_mobile',
        },
      },
    },
  },
};
