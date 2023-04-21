import { render } from '@testing-library/react';

import ProfileAvatar from './ProfileAvatar';
import { cryptoUserSession, normalUserSessionWithImage } from './examples';

describe('ProfileAvatar', () => {
  it('should render crypto user successfully', () => {
    const { baseElement } = render(<ProfileAvatar session={cryptoUserSession} />);
    expect(baseElement).toBeTruthy();
  });
  it('should render normal user successfully', () => {
    const { baseElement } = render(
      <ProfileAvatar session={normalUserSessionWithImage} />
    );
    expect(baseElement).toBeTruthy();
  });
});
