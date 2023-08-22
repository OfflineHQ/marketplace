import { deleteTables, createDbClient, type PgClient } from '@test-utils/db';
import { adminSdk } from '@gql/admin/api';
import {
  Currency_Enum,
  EventPassPricing_Insert_Input,
} from '@gql/shared/types';

export const eventPassPricing = {
  eventPassId: 'some-unique-id',
  maxAmount: 100,
  priceAmount: 120000,
  priceCurrency: Currency_Enum.Usd,
} satisfies EventPassPricing_Insert_Input;

const newEventPassPricing = {
  maxAmount: 200,
  maxAmountPerUser: 10,
  priceAmount: 1300000,
} satisfies EventPassPricing_Insert_Input;

export const eventPassPricing2 = {
  eventPassId: 'some-unique-id-2',
  ...newEventPassPricing,
  priceCurrency: Currency_Enum.Usd,
} satisfies EventPassPricing_Insert_Input;

describe('eventPassPricing order integration tests', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, '"eventPassPricing"');
  });
  afterAll(async () => {
    await client.end();
  });
  afterEach(async () => {
    // await closeConnection();
    await deleteTables(client, '"eventPassPricing"');
  });
  it('create eventPassPricing successfully', async () => {
    const res = await adminSdk.CreateEventPassPricing({ eventPassPricing });
    expect(res.insert_eventPassPricing_one?.eventPassId).toEqual(
      eventPassPricing.eventPassId
    );
    expect(res.insert_eventPassPricing_one?.maxAmount).toEqual(
      eventPassPricing.maxAmount
    );
    expect(res.insert_eventPassPricing_one?.priceAmount).toEqual(
      eventPassPricing.priceAmount
    );
    expect(res.insert_eventPassPricing_one?.priceCurrency).toEqual(
      eventPassPricing.priceCurrency
    );
  });
  it('update eventPassPricing successfully', async () => {
    const created = await adminSdk.CreateEventPassPricing({ eventPassPricing });
    const newEventPassPricing = {
      maxAmount: 200,
      maxAmountPerUser: 10,
      priceAmount: 1300000,
    } satisfies EventPassPricing_Insert_Input;
    const res = await adminSdk.UpdateEventPassPricing({
      id: created.insert_eventPassPricing_one?.id as string,
      eventPassPricing: newEventPassPricing,
    });
    expect(res.update_eventPassPricing_by_pk?.eventPassId).toEqual(
      eventPassPricing.eventPassId
    );
    expect(res.update_eventPassPricing_by_pk?.maxAmount).toEqual(
      newEventPassPricing.maxAmount
    );
    expect(res.update_eventPassPricing_by_pk?.maxAmountPerUser).toEqual(
      newEventPassPricing.maxAmountPerUser
    );
    expect(res.update_eventPassPricing_by_pk?.priceAmount).toEqual(
      newEventPassPricing.priceAmount
    );
  });
});
