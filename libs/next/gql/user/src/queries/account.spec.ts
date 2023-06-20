import {
  alphaAdminClient,
  betaAdminClient,
  sebGoogleClient,
} from '@test-utils/gql';
import { deleteAccounts, seedDb } from '@test-utils/db';

describe('user access security tests', () => {
  const alphaAdmin = alphaAdminClient();
  const betaAdmin = betaAdminClient();
  const sebGoogle = sebGoogleClient();
  beforeAll(async () => {
    await deleteAccounts();
    // seed the database with three users alpha, beta and seb
    await seedDb('./tools/test/seeds/account.sql');
  });

  afterAll(async () => {
    await deleteAccounts();
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
    expect(data.account[0]).toEqual(betaAdmin.me);
  });
  it("user seb can't retrieve beta's information by email", async () => {
    const data = await sebGoogle.GetAccountByEmail({
      email: betaAdmin.me.email as string,
    });
    expect(data.account[0]).toBeUndefined();
  });
});
