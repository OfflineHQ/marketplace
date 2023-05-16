import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Card.stories';

const { Default, Overflow, WithForm } = composeStories(stories);

describe('Card', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, Overflow, WithForm];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
