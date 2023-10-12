// PassPurchase.spec.tsx
import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/next-intl';
import { screen } from '@testing-library/react';
import * as stories from './PassPurchase.stories';

const { NoPassSelected, SelectPasses, WithFullSizeAndBackButton } =
  composeStories(stories);

jest.mock('@next/navigation', () => ({
  ...jest.requireActual('@next/navigation'),
  useRouter: () => ({
    back: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

describe('PassPurchase', () => {
  test('CardFooter does not appear when no passes are selected', () => {
    renderWithIntl(<NoPassSelected />);
    const cartButton = screen.queryByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).not.toBeInTheDocument();

    const passTotal = screen.queryByText(/Total/i);
    expect(passTotal).not.toBeInTheDocument();
  });
  test('CardFooter appears when passes are selected', async () => {
    renderWithIntl(<SelectPasses />);
    await SelectPasses.play();
    const cartButton = screen.getByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();

    const passTotal = screen.getByText(/Total/i);
    expect(passTotal).toBeInTheDocument();
  });
  test.skip('Next Link provided with backButtonLink', () => {
    const backButtonLink = { href: '/dummy' };
    renderWithIntl(
      <WithFullSizeAndBackButton backButtonLink={backButtonLink} />
    );
    const backButton = screen.getByRole('link', {
      name: /Go back to the event/i,
    });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', backButtonLink.href);
  });
});
