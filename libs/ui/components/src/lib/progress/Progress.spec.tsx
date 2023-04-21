import { render } from '@testing-library/react';

import { Progress } from './Progress';

describe('Progress', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Progress />);
    expect(baseElement).toBeTruthy();
  });
});
