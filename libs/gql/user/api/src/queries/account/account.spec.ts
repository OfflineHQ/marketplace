import {
  createDbClient,
  deleteAllTables,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import {
  alphaUserClient,
  betaUserClient,
  googleUserClient,
} from '@test-utils/gql';

describe('user access security tests', () => {
  let client: PgClient;
  const alphaUser = alphaUserClient();
  const betaUser = betaUserClient();
  const googleUser = googleUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
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
    expect(account.email).toEqual('');
  });
  it("user beta can't retrieve alpha's information", async () => {
    const data = await betaUser.GetAccount({ address: alphaUser.me.address });
    expect(data.account[0]).toBeUndefined();
  });
  it('user alpha can retrieve his information by email', async () => {
    const data = await alphaUser.GetAccountByEmail({
      email: alphaUser.me.email as string,
    });
    const account = data.account[0];
    expect(account.id).toEqual(alphaUser.me.id);
    expect(account.email).toEqual(alphaUser.me.email);
  });
  it('user beta can retrieve his information by email even if has no email', async () => {
    const data = await betaUser.GetAccountByEmail({
      email: '',
    });
    const account = data.account[0];
    expect(account.id).toEqual(betaUser.me.id);
    expect(account.email).toEqual('');
  });
  it("user google can't retrieve alpha's information by email", async () => {
    const data = await googleUser.GetAccountByEmail({
      email: alphaUser.me.email as string,
    });
    expect(data.account[0]).toBeUndefined();
  });
});
