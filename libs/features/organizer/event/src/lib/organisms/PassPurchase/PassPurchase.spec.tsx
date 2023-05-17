// PassPurchase.spec.tsx
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassPurchase.stories';

const { Default, WithPassesSelected } = composeStories(stories);

describe('PassPurchase', () => {
  test('renders PassPurchase with initial values', () => {
    render(<Default />);
    const passCards = screen.getAllByRole('button');
    expect(passCards).toHaveLength(4); // Two buttons (increment and decrement) for each PassCard
  });

  test('CardFooter appears when passes are selected', () => {
    render(<WithPassesSelected />);
    const cartButton = screen.getByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();

    const passTotal = screen.getByText(/Total/i);
    expect(passTotal).toBeInTheDocument();
  });

  test('CardFooter does not appear when no passes are selected', () => {
    render(<Default />);
    const cartButton = screen.queryByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).not.toBeInTheDocument();

    const passTotal = screen.queryByText(/Total/i);
    expect(passTotal).not.toBeInTheDocument();
  });
});
