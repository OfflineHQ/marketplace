// PassPurchaseSheetContainer.spec.tsx
import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@test-utils/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassPurchaseSheetContainer.stories';

const { Default, WithFullSize } = composeStories(stories);

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

describe('PassPurchaseSheetContainer', () => {
  test('onOpenChange is called when close button is clicked', () => {
    const onOpenChangeMock = jest.fn();

    renderWithIntl(<Default onOpenChange={onOpenChangeMock} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onOpenChangeMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    const sheet = screen.queryByText(/title/i);
    expect(sheet).toBeNull();
  });

  test('onOpenChange is called when "Go back" button is clicked', () => {
    const onOpenChangeMock = jest.fn();

    renderWithIntl(<WithFullSize onOpenChange={onOpenChangeMock} />);
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
