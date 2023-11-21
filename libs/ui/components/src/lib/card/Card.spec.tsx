import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './Card.stories';

const { Default, Overflow, WithForm, Distinct, InsideDistinct, Loading } =
  composeStories(stories);

describe('Card', () => {
  it('should render successfully Stories', () => {
    const stories = [
      Default,
      Overflow,
      WithForm,
      Distinct,
      InsideDistinct,
      Loading,
    ];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
