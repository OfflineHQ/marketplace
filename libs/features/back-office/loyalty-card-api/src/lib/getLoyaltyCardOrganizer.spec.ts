import { adminSdk } from '@gql/admin/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getLoyaltyCardOrganizer } from './getLoyaltyCardOrganizer';

jest.mock('@next/next-auth/user');
jest.mock('@gql/admin/api');

describe('getLoyaltyCardOrganizer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return loyalty card parameters when user is found', async () => {
    const mockUser = {
      role: {
        organizerId: 'test-organizer-id',
      },
    };
    const mockLoyaltyCard = {
      id: 'test-loyalty-card-id',
      // Add other loyalty card properties here
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (adminSdk.GetLoyaltyCardOrganizer as jest.Mock).mockResolvedValue({
      organizer: {
        loyaltyCard: mockLoyaltyCard,
      },
    });

    const result = await getLoyaltyCardOrganizer();

    expect(result).toEqual(mockLoyaltyCard);
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.GetLoyaltyCardOrganizer).toHaveBeenCalledWith({
      organizerId: 'test-organizer-id',
      stage: expect.any(String),
    });
  });

  it('should throw an error when user is not found', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    await expect(getLoyaltyCardOrganizer()).rejects.toThrow('User not found');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.GetLoyaltyCardOrganizer).not.toHaveBeenCalled();
  });

  it('should throw an error when user role is not found', async () => {
    const mockUser = {
      role: null,
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    await expect(getLoyaltyCardOrganizer()).rejects.toThrow('User not found');
    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.GetLoyaltyCardOrganizer).not.toHaveBeenCalled();
  });
});
