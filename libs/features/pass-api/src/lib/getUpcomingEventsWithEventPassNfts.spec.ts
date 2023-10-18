import { Locale } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getUpcomingEventsWithEventPassNfts } from './getUpcomingEventsWithEventPassNfts';
import env from '@env/server';

jest.mock('@next/next-auth/user');
jest.mock('@gql/user/api');

describe('getUpcomingEventsWithEventPassNfts', () => {
  it('should call the API with the correct address', async () => {
    const mockUser = { address: 'alpha_user_address' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (userSdk.GetUpcomingEventsWithEventPassNfts as jest.Mock).mockResolvedValue(
      {},
    );

    const props = {
      locale: 'en' as Locale,
      currentDate: '2023-08-26 12:00:00.155813+01',
    };

    await getUpcomingEventsWithEventPassNfts(props);

    expect(userSdk.GetUpcomingEventsWithEventPassNfts).toHaveBeenCalledWith(
      {
        ...props,
        address: mockUser.address,
        stage: env.HYGRAPH_STAGE,
      },
      { next: { tags: ['userEventPassNfts'] } },
    );
  });

  it('should throw an error if user is not logged in', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const props = {
      locale: 'en' as Locale,
      currentDate: '2023-08-26 12:00:00.155813+01',
    };

    await expect(getUpcomingEventsWithEventPassNfts(props)).rejects.toThrow(
      'User not logged in',
    );
  });
});
