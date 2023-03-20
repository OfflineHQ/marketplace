import { render } from '@testing-library/react';

import HoverCard from './HoverCard';

describe('HoverCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HoverCard />);
    expect(baseElement).toBeTruthy();
  });
});
