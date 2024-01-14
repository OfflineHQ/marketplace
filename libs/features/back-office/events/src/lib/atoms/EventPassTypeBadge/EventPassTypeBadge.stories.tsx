import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  EventPassTypeBadge,
  EventPassTypeBadgeProps,
} from './EventPassTypeBadge';
import { darkMode } from '@test-utils/storybook';

const typeOptions = Object.values(EventPassNftContractType_Enum);

const EventPassTypeBadgeStory: Meta<typeof EventPassTypeBadge> = {
  title: 'Atoms/EventPassTypeBadge',
  component: EventPassTypeBadge,
  argTypes: {
    type: {
      options: typeOptions,
      control: { type: 'select' },
    },
  },
};

export default EventPassTypeBadgeStory;

type EventPassTypeBadgeStory = StoryObj<EventPassTypeBadgeProps>;

export const Default: EventPassTypeBadgeStory = {
  args: {
    type: EventPassNftContractType_Enum.Normal,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(await screen.findByText(/upfront details/i));
    await screen.findByText(/Present all details of the event/i);
  },
};

export const DelayedReveal: EventPassTypeBadgeStory = {
  args: {
    type: EventPassNftContractType_Enum.DelayedReveal,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(await screen.findByText(/surprise reveal/i));
    await screen.findByText(/Initially display placeholder/i);
  },
};

const AllTypesComponent: React.FC = () => (
  <>
    {typeOptions.map((type) => (
      <EventPassTypeBadge key={type} type={type} className="mb-2" />
    ))}
  </>
);

export const AllTypes = {
  render: AllTypesComponent,
  argTypes: {
    type: {
      control: false,
    },
  },
};

export const AllTypesWithDarkMode = {
  render: AllTypesComponent,
  argTypes: {
    type: {
      control: false,
    },
  },
  parameters: {
    ...darkMode,
  },
};
