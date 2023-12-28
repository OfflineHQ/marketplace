import { adminSdk } from '@gql/admin/api';
import { Currency_Enum, PassPricing_Insert_Input } from '@gql/shared/types';
import { createDbClient, deleteTables, type PgClient } from '@test-utils/db';

export const passPricing = {
  eventPassId: 'some-unique-id',
  amount: 120000,
  currency: Currency_Enum.Usd,
} satisfies PassPricing_Insert_Input;

const newPassPricing = {
  amount: 1300000,
} satisfies PassPricing_Insert_Input;
describe('passPricing integration tests', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['passPricing']);
  });
  afterAll(async () => {
    await client.end();
  });
  afterEach(async () => {
    // await closeConnection();
    await deleteTables(client, ['passPricing']);
  });
  it('create passPricing successfully', async () => {
    const res = await adminSdk.CreatePassPricing({ passPricing });
    expect(res.insert_passPricing_one?.eventPassId).toEqual(
      passPricing.eventPassId,
    );
    expect(res.insert_passPricing_one?.amount).toEqual(passPricing.amount);
    expect(res.insert_passPricing_one?.currency).toEqual(passPricing.currency);
  });
  it('update passPricing successfully', async () => {
    const created = await adminSdk.CreatePassPricing({ passPricing });
    const res = await adminSdk.UpdatePassPricing({
      id: created.insert_passPricing_one?.id as string,
      passPricing: newPassPricing,
    });
    expect(res.update_passPricing_by_pk?.eventPassId).toEqual(
      passPricing.eventPassId,
    );
    expect(res.update_passPricing_by_pk?.amount).toEqual(newPassPricing.amount);
  });
});
