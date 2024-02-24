import { render } from '@testing-library/react';

import UnlockShopify from './unlock-shopify';

describe('UnlockShopify', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UnlockShopify />);
    expect(baseElement).toBeTruthy();
  });
});
