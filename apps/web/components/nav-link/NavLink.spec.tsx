import { render } from '@testing-library/react';

import { NavLinkExample } from './examples';

jest.mock('next/router', () => require('next-router-mock'));

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavLinkExample href="/dummy">dummy</NavLinkExample>);
    expect(baseElement).toBeTruthy();
  });
});
