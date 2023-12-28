import { adminSdk } from '@gql/admin/api';
import { PassAmount_Insert_Input } from '@gql/shared/types';
import { createDbClient, deleteTables, type PgClient } from '@test-utils/db';

export const passAmount = {
  eventPassId: 'some-unique-id',
  maxAmount: 100,
} satisfies PassAmount_Insert_Input;

const newPassAmount = {
  maxAmount: 200,
  maxAmountPerUser: 10,
} satisfies PassAmount_Insert_Input;

describe('passAmount order integration tests', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['passAmount']);
  });
  afterAll(async () => {
    await client.end();
  });
  afterEach(async () => {
    // await closeConnection();
    await deleteTables(client, ['passAmount']);
  });
  it('create passAmount successfully', async () => {
    const res = await adminSdk.CreatePassAmount({ passAmount });
    expect(res.insert_passAmount_one?.eventPassId).toEqual(
      passAmount.eventPassId,
    );
    expect(res.insert_passAmount_one?.maxAmount).toEqual(passAmount.maxAmount);
  });
  it('update passAmount successfully', async () => {
    const created = await adminSdk.CreatePassAmount({ passAmount });
    const res = await adminSdk.UpdatePassAmount({
      id: created.insert_passAmount_one?.id as string,
      passAmount: newPassAmount,
    });
    expect(res.update_passAmount_by_pk?.eventPassId).toEqual(
      passAmount.eventPassId,
    );
    expect(res.update_passAmount_by_pk?.maxAmount).toEqual(
      newPassAmount.maxAmount,
    );
    expect(res.update_passAmount_by_pk?.maxAmountPerUser).toEqual(
      newPassAmount.maxAmountPerUser,
    );
  });
});
