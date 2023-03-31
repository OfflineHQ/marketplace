import { render } from '@testing-library/react';

import { NavLink } from './NavLink';

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavLink href="dummy"> dummy </NavLink>);
    expect(baseElement).toBeTruthy();
  });
});
