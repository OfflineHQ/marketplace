import { Locale } from '@gql/shared/types';
import { getPassedEventsWithEventPassNfts } from './getPassedEventsWithEventPassNfts';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

jest.mock('@next/next-auth/user');
jest.mock('@gql/user/api');

describe('getPassedEventsWithEventPassNfts', () => {
  it('should call the API with the correct address', async () => {
    const mockUser = { address: 'alpha_user_address' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (userSdk.GetPassedEventsWithEventPassNfts as jest.Mock).mockResolvedValue(
      {}
    );

    const props = {
      locale: 'en' as Locale,
      currentDate: '2023-08-26 12:00:00.155813+01',
    };

    await getPassedEventsWithEventPassNfts(props);

    expect(userSdk.GetPassedEventsWithEventPassNfts).toHaveBeenCalledWith({
      ...props,
      address: mockUser.address,
      stage: process.env.HYGRAPH_STAGE,
    });
  });

  it('should throw an error if user is not logged in', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const props = {
      locale: 'en' as Locale,
      currentDate: '2023-08-26 12:00:00.155813+01',
    };

    await expect(getPassedEventsWithEventPassNfts(props)).rejects.toThrow(
      'User not logged in'
    );
  });
});
