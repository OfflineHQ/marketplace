import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { DateRange, DateRangeSkeleton } from './DateRange';
import {
  DateRangeExample,
  dateRangeProps,
  dateRangeProps2,
  datesSameDay,
} from './examples';

const meta: Meta<typeof DateRange> = {
  title: 'Date/DateRange',
  component: DateRange,
  args: dateRangeProps,
  render: (props) => <DateRangeExample {...props} />,
};

export default meta;

type Story = StoryObj<typeof DateRange>;

export const WithParisDates: Story = {
  play: async ({ canvasElement }) => {
    screen.getByText(/Fri, Jan 1, 2021, 10:00 PM/i);
    screen.getByText(/Sun, Jan 3, 2021, 1:00 PM/i);
  },
};

export const WithNewYorkDates: Story = {
  args: dateRangeProps2,
  play: async ({ canvasElement }) => {
    screen.getByText(/Thu, Feb 18, 2021, 7:00 AM/i);
    screen.getByText(/Tue, Jan 19, 2021, 7:00 AM/i);
    // Get the button by its aria-label
    const button = screen.getByLabelText('Fill Info');
    userEvent.click(button);
    screen.findByText(/In your own time zone/i);
  },
};

export const WithSameDayDates: Story = {
  args: datesSameDay,
};

export const Loading: Story = {
  render: () => <DateRangeSkeleton />,
};
