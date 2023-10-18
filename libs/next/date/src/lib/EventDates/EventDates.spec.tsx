// EventDates.spec.tsx
import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/next-intl';
import { screen } from '@testing-library/react';
import { EventDates } from './EventDates';
import * as stories from './EventDates.stories';

const { Default, Detailed, OneDate, OneDateSeveralDays } =
  composeStories(stories);

// TODO retest this component when the TZ issue is fixed
describe.skip('EventDates', () => {
  it('renders the default component', () => {
    renderWithIntl(<Default />);
    screen.getByText(/Thu, June 1 at 1:00 AM/i);
    screen.getByText(/Sat, June 3 at 12:00 AM/i);
  });

  it('renders component with detailed dates', () => {
    renderWithIntl(<Detailed />);
    screen.getByText('Thu, June 1');
    screen.getByText('1:00 AM');
    screen.getByText('9:00 AM');
    screen.getByText('Fri, June 2 at 1:00 PM');
    screen.getByText('Sat, June 3 at 12:00 AM');
  });

  it('renders component with one date', () => {
    renderWithIntl(<OneDate />);
    screen.getByText('Thu, June 1');
    screen.getByText('1:00 AM');
    screen.getByText('9:00 AM');
  });

  it('renders component with one date and several days', () => {
    renderWithIntl(<OneDateSeveralDays />);
    screen.getByText('Tue, September 12 at 7:00 PM');
    screen.getByText('Thu, September 14 at 11:00 PM');
  });

  it('renders nothing if dates is an empty array', () => {
    const { container } = renderWithIntl(
      <EventDates eventDateLocations={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
