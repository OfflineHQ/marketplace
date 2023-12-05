import { getCurrentUser } from '@next/next-auth/user';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
} from '@test-utils/db';
import { accounts } from '@test-utils/gql';
import { isFollowingOrganizer } from './isFollowingOrganizer';

jest.mock('@next/next-auth/user', () => {
  return {
    isConnected: jest.fn().mockReturnValue(true),
    getCurrentUser: jest.fn(),
  };
});
describe('isFollowingOrganizer', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['account', 'follow']);
    await applySeeds(client, ['account', 'follow']);
  });
  afterAll(async () => {
    await deleteTables(client, ['account', 'follow']);
    await client.end();
  });
  // Returns true if user is following the organizer
  it('should return true for user alpha_user because following organizer "test"', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(accounts.alpha_user);
    const result = await isFollowingOrganizer('test');
    expect(result).toBe(true);
  });
  it('should return false for user beta_user because following organizer "test"', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(accounts.beta_user);
    const result = await isFollowingOrganizer('test');
    expect(result).toBe(false);
  });
});
