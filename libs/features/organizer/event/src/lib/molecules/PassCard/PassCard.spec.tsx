import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@test-utils/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassCard.stories';

const { Default, BoundaryConditions, BoundaryConditionsPerUser } =
  composeStories(stories);

describe('PassCard', () => {
  test('renders PassCard with initial values', () => {
    renderWithIntl(<Default />);
    const name = screen.getByText('General Admission');
    const description = screen.getByText('General Admission to the event');
    const price = screen.getByText('€1,300.00');
    const amount = screen.getByText('0');
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });

  test('amount increases when increment button is clicked', () => {
    renderWithIntl(<Default />);
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('increment button is disabled when amount equals maxVal', () => {
    renderWithIntl(<BoundaryConditions />);
    const amount = screen.getByText('6');
    expect(amount).toBeInTheDocument();
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
  });

  test('amount decreases when decrement button is clicked', () => {
    renderWithIntl(<BoundaryConditionsPerUser />);
    expect(screen.getByText('3')).toBeInTheDocument();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    fireEvent.click(decrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
