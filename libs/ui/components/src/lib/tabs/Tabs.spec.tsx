import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Tabs.stories';

const { Default, WithCardAndForm } = composeStories(stories);

describe('Tabs', () => {
  it('should render successfully from stories', () => {
    const stories = [Default, WithCardAndForm];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
