import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';

import { DateRange } from './DateRange';
import { dateRangeProps, dateRangeProps2 } from './examples';

const meta: Meta<typeof DateRange> = {
  component: DateRange,
  args: dateRangeProps,
  render: (props) => <DateRange {...props} />,
};

export default meta;

type Story = StoryObj<typeof DateRange>;

export const WithParisDates: Story = {
  play: async ({ canvasElement }) => {
    screen.getByText(/Fri, Jan 1, 2021, 9:00 PM/i);
    screen.getByText(/Sun, Jan 3, 2021, 12:00 PM/i);
  },
};

export const WithNewYorkDates: Story = {
  args: dateRangeProps2,
  play: async ({ canvasElement }) => {
    screen.getByText(/Thu, Feb 18, 2021, 6:00 AM/i);
    screen.getByText(/Tue, Jan 19, 2021, 6:00 AM/i);
    // Get the button by its aria-label
    const button = screen.getByLabelText('Fill Info');
    userEvent.click(button);
    screen.findByText(/In your own time zone/i);
  },
};
