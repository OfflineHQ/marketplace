import { render } from '@testing-library/react';

import { Command } from './Command';

describe('Command', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Command />);
    expect(baseElement).toBeTruthy();
  });
});
