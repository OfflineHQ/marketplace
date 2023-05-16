// PassSelection.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassSelection.stories';

const { Default, BoundaryConditions } = composeStories(stories);

describe('PassSelection', () => {
  test('renders PassSelection with initial values', () => {
    render(<Default />);
    const passCards = screen.getAllByRole('button');
    expect(passCards).toHaveLength(4); // Two buttons (increment and decrement) for each PassCard
  });

  test('increment buttons are disabled at max value', () => {
    render(<BoundaryConditions />);
    const incrementButtons = screen.getAllByRole('button', {
      name: /increment value/i,
    });
    incrementButtons.forEach((incrementButton) => {
      expect(incrementButton).toBeDisabled();
    });
  });

  test('decrement buttons are not disabled at max value', () => {
    render(<BoundaryConditions />);
    const decrementButtons = screen.getAllByRole('button', {
      name: /decrement value/i,
    });
    decrementButtons.forEach((decrementButton) => {
      expect(decrementButton).not.toBeDisabled();
    });
  });
});
