// EventDates.spec.tsx
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './EventDates.stories';

const { Default, Detailed, OneDate } = composeStories(stories);

describe('EventDates', () => {
  it('renders the default component', () => {
    render(<Default />);
    expect(screen.getByText(/from/i)).toBeInTheDocument();
    expect(screen.getByText(/to/i)).toBeInTheDocument();
  });

  it('renders component with one date', () => {
    render(<OneDate />);
    expect(screen.getByText(/from/i)).toBeInTheDocument();
    expect(screen.getByText(/to/i)).toBeInTheDocument();
  });

  // it('renders component with detailed dates', () => {
  //   render(<Detailed />);
  //   Detailed.dates.forEach((date) => {
  //     expect(
  //       screen.getByText(new RegExp(date.dateStart.slice(0, 10), 'i'))
  //     ).toBeInTheDocument();
  //     expect(
  //       screen.getByText(new RegExp(date.dateEnd.slice(0, 10), 'i'))
  //     ).toBeInTheDocument();
  //   });
  // });
});
