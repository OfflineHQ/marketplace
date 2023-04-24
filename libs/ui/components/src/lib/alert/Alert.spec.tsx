import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Alert.stories';

const { Default, Destructive } = composeStories(stories);

describe('Alert', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, Destructive];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
