import { render } from '@testing-library/react';

import FeaturesCart from './features-cart';

describe('FeaturesCart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesCart />);
    expect(baseElement).toBeTruthy();
  });
});
