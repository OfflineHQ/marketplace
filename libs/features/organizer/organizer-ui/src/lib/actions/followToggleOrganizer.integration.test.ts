import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
} from '@test-utils/db';
import { accounts, alphaUserClient } from '@test-utils/gql';
import { followToggleOrganizer } from './followToggleOrganizer';

jest.mock('@next/next-auth/user', () => {
  return {
    isConnected: jest.fn().mockReturnValue(true),
    getCurrentUser: jest.fn(),
  };
});
describe('followToggleOrganizer', () => {
  const alphaUser = alphaUserClient();
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
    (getCurrentUser as jest.Mock).mockResolvedValue(accounts.alpha_user);
    jest
      .spyOn(userSdk, 'InsertFollowOrganizer')
      .mockImplementation(async (args: any) => {
        return await alphaUser.InsertFollowOrganizer(args);
      });
    await deleteTables(client, ['account', 'follow']);
    await applySeeds(client, ['account', 'follow']);
  });
  afterAll(async () => {
    await deleteTables(client, ['account', 'follow']);
    await client.end();
  });
  // Returns false if user was following the organizer
  it('should returns false as alpha_user was following the organizer "test"', async () => {
    const result = await followToggleOrganizer('test');
    expect(result).toBe(false);
  });
  it('should returns true as alpha_user was not following the organizer "dummy"', async () => {
    const result = await followToggleOrganizer('dummy');
    expect(result).toBe(true);
  });
});
