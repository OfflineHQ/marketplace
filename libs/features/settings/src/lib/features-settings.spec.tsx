import { render } from '@testing-library/react';

import FeaturesSettings from './features-settings';

describe('FeaturesSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesSettings />);
    expect(baseElement).toBeTruthy();
  });
});
