import { render } from '@testing-library/react';

import { NavDesktop } from './NavDesktop';
import { menuSections } from './examples';

jest.mock('next/router', () => require('next-router-mock'));

describe('NavDesktop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavDesktop menuSections={menuSections} />);
    expect(baseElement).toBeTruthy();
  });
});
