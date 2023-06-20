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
  it.skip('user alpha can retrieve his information', async () => {
    const data = await alphaAdmin.getAccount({ id: alphaAdmin.me.id });
    expect(data.account[0]).toEqual(alphaAdmin.me);
  });
  it('user beta can retrieve his information', async () => {
    const data = await betaAdmin.getAccount({ id: betaAdmin.me.id });
    expect(data.account[0]).toEqual(betaAdmin.me);
  });
  it("user beta can't retrieve alpha's information", async () => {
    const data = await betaAdmin.getAccount({ id: alphaAdmin.me.id });
    expect(data.account[0]).toBeUndefined();
  });
  it('user beta can retrieve his information by email', async () => {
    const data = await betaAdmin.getAccountByEmail({
      email: betaAdmin.me.email as string,
    });
    expect(data.account[0]).toEqual(betaAdmin.me);
  });
  it("user seb can't retrieve beta's information by email", async () => {
    const data = await sebGoogle.getAccountByEmail({
      email: betaAdmin.me.email as string,
    });
    expect(data.account[0]).toBeUndefined();
  });
});
