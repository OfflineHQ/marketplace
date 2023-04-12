import { render } from '@testing-library/react';

import ProfileNav from './ProfileNav';
import { menuItems } from './examples';
import { cryptoUserSession } from '../profile-avatar/examples';

describe('ProfileNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ProfileNav session={cryptoUserSession} items={menuItems} />
    );
    expect(baseElement).toBeTruthy();
  });
});
