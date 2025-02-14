// Generated by CodiumAI

import { adminSdk } from '@gql/admin/api';
import { getCurrentUser } from '@next/next-auth/user';
import { accounts } from '@test-utils/gql';
import { isFollowingOrganizer } from './isFollowingOrganizer';

const user = accounts.alpha_user;

jest.mock('@gql/admin/api');

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));

describe('isFollowingOrganizer', () => {
  beforeAll(() => {
    (getCurrentUser as jest.Mock).mockResolvedValue(user);
  });
  beforeEach(() => {
    (adminSdk.CheckFollowingOrganizer as jest.Mock).mockClear();
  });
  // Returns true if user is following the organizer
  it('should return true when user is following the organizer', async () => {
    (adminSdk.CheckFollowingOrganizer as jest.Mock).mockResolvedValue({
      follow_by_pk: {},
    });
    const result = await isFollowingOrganizer('organizer_slug');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.CheckFollowingOrganizer).toHaveBeenCalledWith({
      accountId: user.id,
      organizerSlug: 'organizer_slug',
    });
    expect(result).toBe(true);
  });
  // Returns false if user is not following the organizer
  it('should return false when user is not following the organizer', async () => {
    (adminSdk.CheckFollowingOrganizer as jest.Mock).mockResolvedValue({
      follow_by_pk: null,
    });
    const result = await isFollowingOrganizer('organizer_slug');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.CheckFollowingOrganizer).toHaveBeenCalledWith({
      accountId: user.id,
      organizerSlug: 'organizer_slug',
    });
    expect(result).toBe(false);
  });
  // Returns false if user is not logged in
  it('should return false when user is not logged in', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null);
    const result = await isFollowingOrganizer('organizer_slug');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  // Returns false if organizerSlug is empty
  it('should return false when organizerSlug is empty', async () => {
    const result = await isFollowingOrganizer('');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  // Returns false if getCurrentUser() throws an error
  it('should return false when getCurrentUser() throws an error', async () => {
    (getCurrentUser as jest.Mock).mockRejectedValueOnce(
      new Error('Auth error'),
    );
    const result = await isFollowingOrganizer('organizer_slug');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  // Throws an error if adminSdk.CheckFollowingOrganizer() returns an error
  it('should throw an error when adminSdk.CheckFollowingOrganizer() returns an error', async () => {
    (adminSdk.CheckFollowingOrganizer as jest.Mock).mockRejectedValueOnce(
      new Error('API error'),
    );
    await expect(isFollowingOrganizer('organizer_slug')).rejects.toThrow(
      'API error',
    );
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.CheckFollowingOrganizer).toHaveBeenCalledWith({
      accountId: user.id,
      organizerSlug: 'organizer_slug',
    });
  });
});
