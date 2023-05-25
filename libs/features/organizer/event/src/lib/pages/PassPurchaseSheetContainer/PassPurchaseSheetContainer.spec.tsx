// PassPurchaseSheetContainer.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassPurchaseSheetContainer.stories';

const { Default, WithFullSize } = composeStories(stories);

describe('PassPurchaseSheetContainer', () => {
  test('onOpenChange is called when close button is clicked', () => {
    const onOpenChangeMock = jest.fn();

    render(<Default onOpenChange={onOpenChangeMock} />);
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
