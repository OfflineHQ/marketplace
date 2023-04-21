import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Button.stories';

const { DefaultButton } = composeStories(stories);

describe('Button', () => {
  test('renders button with text', () => {
    render(<DefaultButton>Test Button</DefaultButton>);
    const buttonElement = screen.getByText(/Test Button/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('onClick handler is called', async () => {
    const onClickSpy = jest.fn();
    render(<DefaultButton onClick={onClickSpy}>Test Button</DefaultButton>);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(onClickSpy).toHaveBeenCalled();

    // Check that the spinner is present and then removed
    expect(screen.queryByRole('status')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
  });

  test('button is disabled when disabled prop is true', () => {
    render(<DefaultButton disabled>default Disabled</DefaultButton>);
    const buttonElement = screen.getByText('default Disabled');
    expect(buttonElement).toBeDisabled();
  });

  test('button displays loading state when isLoading is true', () => {
    render(<DefaultButton isLoading>default Loading</DefaultButton>);
    screen.getByText('default Loading');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
