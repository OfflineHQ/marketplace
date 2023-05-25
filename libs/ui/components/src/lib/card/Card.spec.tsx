import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Card.stories';

const {
  FullSizeStickyFooter,
  FullSizeStickyFooterOverflow,
  WithForm,
  Loading,
} = composeStories(stories);

describe('Card', () => {
  it('should render successfully Stories', () => {
    const stories = [
      FullSizeStickyFooter,
      FullSizeStickyFooterOverflow,
      WithForm,
      Loading,
    ];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
