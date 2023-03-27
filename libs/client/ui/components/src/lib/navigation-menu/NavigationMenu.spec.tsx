import { render } from '@testing-library/react';

import { NavigationMenu } from './NavigationMenu';

describe('NavigationMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavigationMenu />);
    expect(baseElement).toBeTruthy();
  });
});
