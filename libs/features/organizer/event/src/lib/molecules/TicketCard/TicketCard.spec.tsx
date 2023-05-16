import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './TicketCard.stories';

const { Default, BoundaryConditions } = composeStories(stories);

describe('TicketCard', () => {
  test('renders TicketCard with initial values', () => {
    render(<Default />);
    const ticketType = screen.getByText('General Admission');
    const description = screen.getByText('General Admission to the event');
    const price = screen.getByText('$1300');
    const numTickets = screen.getByText('2');
    expect(ticketType).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(numTickets).toBeInTheDocument();
  });

  test('increment button is disabled when numTickets equals maxVal', () => {
    render(<BoundaryConditions />);
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
  });

  test('numTickets increases when increment button is clicked', () => {
    render(<Default />);
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    fireEvent.click(incrementButton);
    const numTickets = screen.getByText('3');
    expect(numTickets).toBeInTheDocument();
  });

  test('numTickets decreases when decrement button is clicked', () => {
    render(<Default />);
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    fireEvent.click(decrementButton);
    const numTickets = screen.getByText('1');
    expect(numTickets).toBeInTheDocument();
  });
});
