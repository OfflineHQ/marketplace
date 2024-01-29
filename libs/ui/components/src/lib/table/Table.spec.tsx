import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './Table.stories';

const { Default } = composeStories(stories);

describe('Table', () => {
  it('should render successfully Stories ', () => {
    const stories = [Default];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
