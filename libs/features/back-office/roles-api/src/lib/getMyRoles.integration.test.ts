import { userSdk } from '@gql/user/api';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
} from '@test-utils/db';
import {
  alphaUserClient,
  betaUserClient,
  deltaUserClient,
} from '@test-utils/gql';
import { getMyRoles } from './getMyRoles';

jest.mock('@next/next-auth/user', () => {
  return {
    isConnected: jest.fn().mockReturnValue(true),
  };
});

describe('getMyRoles Integration Test', () => {
  let client: PgClient;

  const alphaUser = alphaUserClient({ isBackOffice: true });
  const betaUser = betaUserClient({ isBackOffice: true });
  const deltaUser = deltaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await applySeeds(client, ['account', 'roleAssignments']);
  });

  afterAll(async () => {
    await deleteTables(client, ['account', 'roleAssignments']);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Alpha User should have two roles', async () => {
    jest.spyOn(userSdk, 'GetMyRoles').mockImplementationOnce(async () => {
      return await alphaUser.GetMyRoles();
    });

    const result = await getMyRoles();
    expect(result.length).toEqual(2);
  });

  it('Beta User should have one role', async () => {
    jest.spyOn(userSdk, 'GetMyRoles').mockImplementationOnce(async () => {
      return await betaUser.GetMyRoles();
    });

    const result = await getMyRoles();
    expect(result.length).toEqual(1);
  });

  it('Delta User should have no role', async () => {
    jest.spyOn(userSdk, 'GetMyRoles').mockImplementationOnce(async () => {
      return await deltaUser.GetMyRoles();
    });

    const result = await getMyRoles();
    expect(result).toEqual([]);
  });

  it('should throw an error when sdk fail', async () => {
    jest.spyOn(userSdk, 'GetMyRoles').mockImplementation(async () => {
      throw new Error('sdk error');
    });

    await expect(getMyRoles()).rejects.toThrow('sdk error');
  });
});
