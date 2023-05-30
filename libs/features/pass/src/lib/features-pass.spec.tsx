import { render } from '@testing-library/react';

import FeaturesPass from './features-pass';

describe('FeaturesPass', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesPass />);
    expect(baseElement).toBeTruthy();
  });
});
