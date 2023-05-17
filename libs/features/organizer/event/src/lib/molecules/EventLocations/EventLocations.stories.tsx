// EventLocations.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { EventLocations, EventLocationsProps } from './EventLocations';
import { eventLocationsProps } from './examples';

const meta = {
  component: EventLocations,
  args: eventLocationsProps,
} satisfies Meta<typeof EventLocations>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
