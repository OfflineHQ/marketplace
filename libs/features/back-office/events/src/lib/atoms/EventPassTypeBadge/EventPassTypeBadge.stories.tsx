import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { Meta, StoryObj } from '@storybook/react';
import {
  EventPassTypeBadge,
  EventPassTypeBadgeProps,
} from './EventPassTypeBadge';

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

export const DefaultEventPassTypeBadge: EventPassTypeBadgeStory = {
  args: {
    type: EventPassNftContractType_Enum.Normal,
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
    darkMode: {
      isDark: true,
    },
  },
};
