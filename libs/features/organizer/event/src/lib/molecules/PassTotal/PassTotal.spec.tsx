// PassTotal.spec.tsx
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './PassTotal.stories';

const { Default } = composeStories(stories);

describe('PassTotal', () => {
  test('renders PassTotal with correct totals', () => {
    render(<Default />);
    screen.getByText(/3 passes selected/i);
    screen.getByText(/total price: \$5100/i);
  });
});
