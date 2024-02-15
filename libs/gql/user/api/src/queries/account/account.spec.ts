import {
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import { alphaUserClient, betaUserClient } from '@test-utils/gql';

describe('user access security tests', () => {
  let client: PgClient;
  const alphaUser = alphaUserClient();
  const betaUser = betaUserClient();
  beforeAll(async () => {
    client = await createDbClient();
  });

  afterAll(async () => {
    await deleteTables(client, ['account']);
    await client.end();
  });

  beforeEach(async () => {
    await deleteTables(client, ['account']);
    // seed the database with three users alpha, beta and google
    await seedDb(client, 'account');
  });

  it('user alpha can retrieve his information', async () => {
    const data = await alphaUser.GetAccount({
      address: alphaUser.me.address.toLowerCase(),
    });
    const account = data.account[0];
    expect(account.id).toEqual(alphaUser.me.id);
  });
  it('user beta can retrieve his information', async () => {
    const data = await betaUser.GetAccount({
      address: betaUser.me.address.toLowerCase(),
    });
    const account = data.account[0];
    expect(account.id).toEqual(betaUser.me.id);
  });
  it("user beta can't retrieve alpha's information", async () => {
    const data = await betaUser.GetAccount({
      address: alphaUser.me.address.toLowerCase(),
    });
    expect(data.account[0]).toBeUndefined();
  });
});
