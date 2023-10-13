// PassPurchaseSheetContainer.spec.tsx
import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/next-intl';
import { fireEvent, screen } from '@testing-library/react';
import * as stories from './PassPurchaseSheetContainer.stories';

const { Default, WithFullSize } = composeStories(stories);

jest.mock('@next/navigation', () => ({
  ...jest.requireActual('@next/navigation'),
  useRouter: () => ({
    back: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

//TODO: solve issue from ConvertedCurrency: async function ConvertedCurrency({ variant, ...props }) { TypeError: Cannot destructure property 'variant' of 'undefined' as it is undefined.
describe.skip('PassPurchaseSheetContainer', () => {
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
