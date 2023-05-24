import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Toast.stories';

const { TextClose } = composeStories(stories);

describe('Toast', () => {
  it('should render successfully and be closable', () => {
    const { baseElement } = render(<TextClose />);
    expect(baseElement).toBeTruthy();
    const button = screen.getByRole('button');
    fireEvent.click(button);
  });
});
