import { render } from '@testing-library/react';
import type { Route } from 'next';

import { NavLinkExample } from './examples';

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NavLinkExample href={'/dummy' as Route}>dummy</NavLinkExample>
    );
    expect(baseElement).toBeTruthy();
  });
});
