import { renderWithIntl } from '@test-utils/next-intl';
import { cryptoUserSession } from '../profile-avatar/examples';
import ProfileNav from './ProfileNav';
import { cryptoUserMenuItems } from './examples';

describe('ProfileNav', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithIntl(
      <ProfileNav user={cryptoUserSession} items={cryptoUserMenuItems} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
