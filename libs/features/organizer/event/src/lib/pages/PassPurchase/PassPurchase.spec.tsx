// PassPurchase.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassPurchase.stories';
import { act } from 'react-dom/test-utils';

const { NoPassSelected, SelectPasses, WithFullSizeAndBackButton } =
  composeStories(stories);

describe('PassPurchase', () => {
  test('CardFooter does not appear when no passes are selected', () => {
    render(<NoPassSelected />);
    const cartButton = screen.queryByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).not.toBeInTheDocument();

    const passTotal = screen.queryByText(/Total/i);
    expect(passTotal).not.toBeInTheDocument();
  });
  test('CardFooter appears when passes are selected', async () => {
    render(<SelectPasses />);
    await SelectPasses.play();
    const cartButton = screen.getByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();

    const passTotal = screen.getByText(/Total/i);
    expect(passTotal).toBeInTheDocument();
  });
  test('Next Link provided with backButtonLink', () => {
    const backButtonLink = { href: '/dummy' };
    render(<WithFullSizeAndBackButton backButtonLink={backButtonLink} />);
    const backButton = screen.getByRole('link', {
      name: /Go back to the event/i,
    });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', backButtonLink.href);
  });
});
