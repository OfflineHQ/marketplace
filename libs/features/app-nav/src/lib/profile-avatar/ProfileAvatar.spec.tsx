import { renderWithIntl } from '@test-utils/next-intl';
import { ProfileAvatar } from './ProfileAvatar';
import { cryptoUserSession, normalUserSessionWithImage } from './examples';

describe('ProfileAvatar', () => {
  it('should render crypto user successfully', () => {
    const { baseElement } = renderWithIntl(
      <ProfileAvatar user={cryptoUserSession} />,
    );
    expect(baseElement).toBeTruthy();
  });
  it('should render normal user successfully', () => {
    const { baseElement } = renderWithIntl(
      <ProfileAvatar user={normalUserSessionWithImage} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
