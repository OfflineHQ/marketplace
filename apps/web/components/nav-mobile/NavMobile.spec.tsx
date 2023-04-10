import { render } from '@testing-library/react';

import { NavMobile } from './NavMobile';
import { menuSections } from './examples';

describe('NavMobile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavMobile menuSections={menuSections} />);
    expect(baseElement).toBeTruthy();
  });
});
