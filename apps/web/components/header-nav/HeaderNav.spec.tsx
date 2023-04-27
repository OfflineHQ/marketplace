import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './HeaderNav.stories';

// Not needed anymore as useRouter is not used in NavLink
// jest.mock('next/router', () => require('next-router-mock'));

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
