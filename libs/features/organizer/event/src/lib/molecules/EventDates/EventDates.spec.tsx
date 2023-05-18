// EventDates.spec.tsx
import { screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/functions';
import { EventDates } from './EventDates';
import * as stories from './EventDates.stories';

const { Default, Detailed, OneDate } = composeStories(stories);

describe('EventDates', () => {
  it('renders the default component', () => {
    renderWithIntl(<Default />);
    screen.getByText('Thu, June 1 at 1:00 AM');
    screen.getByText('Sat, June 3 at 12:00 AM');
  });

  it('renders component with detailed dates', () => {
    renderWithIntl(<Detailed />);
    screen.getByText('Thu, June 1');
    screen.getByText('1:00 AM');
    screen.getByText('9:00 AM');
    screen.getByText('Fri, June 2');
    screen.getByText('1:00 PM');
    screen.getByText('12:00 AM');
  });

  it('renders component with one date', () => {
    renderWithIntl(<OneDate />);
    screen.getByText('Thu, June 1');
    screen.getByText('1:00 AM');
    screen.getByText('9:00 AM');
  });

  it('renders nothing if dates is an empty array', () => {
    const { container } = renderWithIntl(<EventDates dates={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
