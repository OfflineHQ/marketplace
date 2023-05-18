import { renderWithIntl } from '@test-utils/functions';
import { composeStories } from '@storybook/react';
import * as stories from './EventDetails.stories';

const { Default, Loading } = composeStories(stories);

describe('EventDetails', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, Loading];
    stories.forEach((Story) => {
      const { baseElement } = renderWithIntl(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
