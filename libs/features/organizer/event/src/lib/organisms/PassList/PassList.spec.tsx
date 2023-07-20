// PassList.spec.tsx
import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@test-utils/next-intl';
import { composeStories } from '@storybook/react';
import * as stories from './PassList.stories';

const { Default, BoundaryConditions } = composeStories(stories);

describe('PassList', () => {
  test('renders PassList with initial values', () => {
    renderWithIntl(<Default />);
    const passCards = screen.getAllByRole('button');
    expect(passCards).toHaveLength(4); // Two buttons (increment and decrement) for each PassCard
  });

  test('increment buttons are disabled at max value', () => {
    renderWithIntl(<BoundaryConditions />);
    const incrementButtons = screen.getAllByRole('button', {
      name: /increment value/i,
    });
    incrementButtons.forEach((incrementButton) => {
      expect(incrementButton).toBeDisabled();
    });
  });

  test('decrement buttons are not disabled at max value', () => {
    renderWithIntl(<BoundaryConditions />);
    const decrementButtons = screen.getAllByRole('button', {
      name: /decrement value/i,
    });
    decrementButtons.forEach((decrementButton) => {
      expect(decrementButton).not.toBeDisabled();
    });
  });
});
