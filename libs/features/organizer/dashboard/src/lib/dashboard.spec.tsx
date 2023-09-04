import { render } from '@testing-library/react';

import { OrganizerDashboard } from './Dashboard';

const mockUser = {
  id: '9cf9d0cf-8d8c-4b53-bd05-57fb9c695268',
  address: '0xf3b5Bda10cd1BbC287b36c2152a315F6d39c2DeF',
  email: 'gouasmi.alexandre@gmail.com',
  emailVerified: false,
  organizerId: 'cljha48gt2ezx0bw13ujz2fwr',
  isOrganizer: true,
};

describe('OrganizerDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrganizerDashboard user={mockUser} />);
    expect(baseElement).toBeTruthy();
  });
});
