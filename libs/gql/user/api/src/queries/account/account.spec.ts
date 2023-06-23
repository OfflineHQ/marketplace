import {
  alphaAdminClient,
  betaAdminClient,
  sebGoogleClient,
} from '@test-utils/gql';
import { deleteAccounts, seedDb, closeConnection } from '@test-utils/db';
import { sleep } from '@utils';

describe('user access security tests', () => {
  const alphaAdmin = alphaAdminClient();
  const betaAdmin = betaAdminClient();
  const sebGoogle = sebGoogleClient();
  beforeEach(async () => {
    await deleteAccounts();
    // seed the database with three users alpha, beta and seb
    await seedDb('./tools/test/seeds/account.sql');
  });
  afterEach(async () => {
    // used to avoid socket hang up error from node-fetch
    await sleep(100);
  });

  afterAll(async () => {
    await deleteAccounts();
    await closeConnection();
  });
  it('user alpha can retrieve his information', async () => {
    const data = await alphaAdmin.GetAccount({
      address: alphaAdmin.me.address,
    });
    const account = data.account[0];
    expect(account.id).toEqual(alphaAdmin.me.id);
    expect(account.email).toEqual(alphaAdmin.me.email);
  });
  it('user beta can retrieve his information', async () => {
    const data = await betaAdmin.GetAccount({ address: betaAdmin.me.address });
    const account = data.account[0];
    expect(account.id).toEqual(betaAdmin.me.id);
    expect(account.email).toEqual(betaAdmin.me.email);
  });
  it("user beta can't retrieve alpha's information", async () => {
    const data = await betaAdmin.GetAccount({ address: alphaAdmin.me.address });
    expect(data.account[0]).toBeUndefined();
  });
  it('user beta can retrieve his information by email', async () => {
    const data = await betaAdmin.GetAccountByEmail({
      email: betaAdmin.me.email as string,
    });
    const account = data.account[0];
    expect(account.id).toEqual(betaAdmin.me.id);
    expect(account.email).toEqual(betaAdmin.me.email);
  });
  it("user seb can't retrieve beta's information by email", async () => {
    const data = await sebGoogle.GetAccountByEmail({
      email: betaAdmin.me.email as string,
    });
    expect(data.account[0]).toBeUndefined();
  });
});
