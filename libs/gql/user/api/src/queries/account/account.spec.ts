import {
  alphaUserClient,
  betaUserClient,
  sebGoogleClient,
} from '@test-utils/gql';
import {
  deleteTables,
  seedDb,
  createDbClient,
  type PgClient,
} from '@test-utils/db';

describe('user access security tests', () => {
  let client: PgClient;
  const alphaUser = alphaUserClient();
  const betaUser = betaUserClient();
  const sebGoogle = sebGoogleClient();

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
      address: alphaUser.me.address,
    });
    const account = data.account[0];
    expect(account.id).toEqual(alphaUser.me.id);
    expect(account.email).toEqual(alphaUser.me.email);
  });
  it('user beta can retrieve his information', async () => {
    const data = await betaUser.GetAccount({ address: betaUser.me.address });
    const account = data.account[0];
    expect(account.id).toEqual(betaUser.me.id);
    expect(account.email).toEqual(betaUser.me.email);
  });
  it("user beta can't retrieve alpha's information", async () => {
    const data = await betaUser.GetAccount({ address: alphaUser.me.address });
    expect(data.account[0]).toBeUndefined();
  });
  it('user beta can retrieve his information by email', async () => {
    const data = await betaUser.GetAccountByEmail({
      email: betaUser.me.email as string,
    });
    const account = data.account[0];
    expect(account.id).toEqual(betaUser.me.id);
    expect(account.email).toEqual(betaUser.me.email);
  });
  it("user seb can't retrieve beta's information by email", async () => {
    const data = await sebGoogle.GetAccountByEmail({
      email: betaUser.me.email as string,
    });
    expect(data.account[0]).toBeUndefined();
  });
});
