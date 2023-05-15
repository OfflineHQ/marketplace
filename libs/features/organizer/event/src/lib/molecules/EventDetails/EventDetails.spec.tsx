import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './EventDetails.stories';

const { Default, Loading } = composeStories(stories);

describe('EventDetails', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, Loading];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
