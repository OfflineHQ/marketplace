import { render } from '@testing-library/react';

import { NavDesktop } from './NavDesktop';

describe('NavDesktop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavDesktop session={null} />);
    expect(baseElement).toBeTruthy();
  });
});
