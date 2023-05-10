import { render } from '@testing-library/react';

import { NavDesktop } from './NavDesktop';
import { menuSections } from './examples';

describe('NavDesktop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavDesktop menuSections={menuSections} />);
    expect(baseElement).toBeTruthy();
  });
});
