import { render } from '@testing-library/react';

import { Toast } from './Toast';

describe('Toast', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<Toast />);
    expect(baseElement).toBeTruthy();
  });
});
