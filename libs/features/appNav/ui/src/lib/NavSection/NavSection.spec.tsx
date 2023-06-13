import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './NavSection.stories';

const { Cart, Skeleton } = composeStories(stories);

describe('HeaderNav', () => {
  it('should render successfully Stories', () => {
    const stories = [Cart, Skeleton];
    stories.forEach((Story) => {
      const { baseElement } = render(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
  it('should pass the correct props to NavLink', () => {
    const mockProps = {
      href: '/test',
    };

    const { getByRole } = render(<Cart {...mockProps} />);
    const linkElement = getByRole('link');

    // Check if NavLink receives correct props
    expect(linkElement.getAttribute('href')).toBe(mockProps.href);
    expect(linkElement.textContent).toBe('Cart');
  });
});
