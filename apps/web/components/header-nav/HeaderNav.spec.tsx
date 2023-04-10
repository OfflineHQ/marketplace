import { render } from '@testing-library/react';
import { menuSections } from '../nav-desktop/examples';

import HeaderNav from './HeaderNav';

describe('HeaderNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <HeaderNav session={null} menuSections={menuSections} />
    );
    expect(baseElement).toBeTruthy();
  });
});
