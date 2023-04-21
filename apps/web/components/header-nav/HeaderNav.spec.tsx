import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './HeaderNav.stories';

jest.mock('next/router', () => require('next-router-mock'));

const { Default, CryptoUser, NormalUser } = composeStories(stories);

describe('HeaderNav', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, CryptoUser, NormalUser];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
