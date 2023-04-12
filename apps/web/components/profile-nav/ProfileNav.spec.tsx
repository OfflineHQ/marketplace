import { render } from '@testing-library/react';

import ProfileNav from './ProfileNav';
import { cryptoUserSession } from '../profile-avatar/examples';

describe('ProfileNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileNav session={cryptoUserSession} />);
    expect(baseElement).toBeTruthy();
  });
});
