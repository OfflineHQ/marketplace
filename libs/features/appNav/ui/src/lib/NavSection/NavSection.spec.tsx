import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/next-intl';
import * as stories from './NavSection.stories';

const { Cart, Skeleton } = composeStories(stories);

describe('HeaderNav', () => {
  it('should render successfully Stories', () => {
    const stories = [Cart, Skeleton];
    stories.forEach((Story) => {
      const { baseElement } = renderWithIntl(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
  it('should pass the correct props to NavLink', () => {
    const mockProps = {
      href: '/test',
    };

    const { getByRole } = renderWithIntl(<Cart {...mockProps} />);
    const linkElement = getByRole('link');

    // Check if NavLink receives correct props
    expect(linkElement.getAttribute('href')).toBe(`/en${mockProps.href}`);
    expect(linkElement.textContent).toBe('Cart');
  });
});
