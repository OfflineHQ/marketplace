import { render } from '@testing-library/react';

import FeaturesHeaderUi from './features-header-ui';

describe('FeaturesHeaderUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesHeaderUi />);
    expect(baseElement).toBeTruthy();
  });
});
