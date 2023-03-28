// TextInput.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './TextInput.stories';

const { Default } = composeStories(stories);

describe('TextInput', () => {
  test('onChange handler is called', () => {
    const onChangeSpy = jest.fn();
    render(<Default onChange={onChangeSpy} />);
    const inputElement = screen.getByPlaceholderText('Enter text...');
    fireEvent.change(inputElement, { target: { value: 'Test input' } });
    expect(onChangeSpy).toHaveBeenCalled();
  });
});
