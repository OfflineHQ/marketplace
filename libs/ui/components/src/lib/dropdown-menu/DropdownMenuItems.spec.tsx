import { render } from '@testing-library/react';

import { menuItems, DropdownMenuItemsDemo } from './examples';

describe('DropdownMenuItems', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DropdownMenuItemsDemo items={menuItems} />);
    expect(baseElement).toBeTruthy();
  });
});
