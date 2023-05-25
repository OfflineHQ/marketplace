// PassPurchase.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassPurchase.stories';

const { Default, WithPassesSelected, WithFullSize } = composeStories(stories);

describe('PassPurchase', () => {
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

  test('onOpenChange is called when close button is clicked', () => {
    const onOpenChangeMock = jest.fn();

    render(<WithPassesSelected onOpenChange={onOpenChangeMock} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onOpenChangeMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    const sheet = screen.queryByText(/title/i);
    expect(sheet).toBeNull();
  });

  test('onOpenChange is called when "Go back" button is clicked', () => {
    const onOpenChangeMock = jest.fn();

    render(<WithFullSize onOpenChange={onOpenChangeMock} />);
    const goBackButton = screen.getByRole('button', {
      name: /Go back to the event/i,
    });
    fireEvent.click(goBackButton);

    expect(onOpenChangeMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    const sheet = screen.queryByText(/title/i);
    expect(sheet).toBeNull();
  });
});
