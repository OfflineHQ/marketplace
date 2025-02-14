import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import * as stories from './BoundedNumericStepper.stories';

const { Default, Increment, Decrement, BoundaryConditions } =
  composeStories(stories);

describe('BoundedNumericStepper', () => {
  test('renders BoundedNumericStepper with initial value', () => {
    render(<Default />);
    const stepperValue = screen.getByText('5');
    expect(stepperValue).toBeInTheDocument();
  });

  test('increments value when increment button is clicked', () => {
    render(<Increment />);
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    fireEvent.click(incrementButton);
    const newValue = screen.getByText('6');
    expect(newValue).toBeInTheDocument();
  });

  test('decrements value when decrement button is clicked', () => {
    render(<Decrement />);
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    fireEvent.click(decrementButton);
    const newValue = screen.getByText('0');
    expect(newValue).toBeInTheDocument();
  });

  test('increment button is disabled at max value', async () => {
    render(<BoundaryConditions />);
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    await expect(incrementButton).toBeDisabled();
  });
});
