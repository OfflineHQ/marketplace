import { render } from '@testing-library/react';

import ProfileNav from './ProfileNav';
import { cryptoUserMenuItems } from './examples';
import { cryptoUserSession } from '../profile-avatar/examples';

describe('ProfileNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ProfileNav user={cryptoUserSession} items={cryptoUserMenuItems} />
    );
    expect(baseElement).toBeTruthy();
  });
});
