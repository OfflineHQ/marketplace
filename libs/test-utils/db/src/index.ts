/* eslint-disable @typescript-eslint/no-var-requires */
import type {
  Account_Insert_Input,
  EventParameters_Insert_Input,
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
  Follow_Insert_Input,
  Kyc_Insert_Input,
  NftTransfer_Insert_Input,
  Order_Insert_Input,
  PackNftContract_Insert_Input,
  PassAmount_Insert_Input,
  PassPricing_Insert_Input,
  PendingOrder,
  PendingOrder_Insert_Input,
  RoleAssignment_Insert_Input,
  StripeCheckoutSession_Insert_Input,
  StripeCustomer_Insert_Input,
} from '@gql/shared/types';
import { isJestRunning } from '@utils';
import { Client } from 'pg';

const fs = require('fs');

let dbName = '';

export const SeedTable = {
  account: 0,
  kyc: 1,
  passAmount: 2,
  passPricing: 3,
  pendingOrder: 4,
  eventPassNftContract: 5,
  eventParameters: 6,
  stripeCustomer: 7,
  stripeCheckoutSession: 8,
  order: 9,
  nftTransfer: 10,
  eventPassNft: 11,
  roleAssignment: 12,
  follow: 13,
  packNftContract: 14,
};

export type SeedTypeMap = {
  account: Account_Insert_Input;
  kyc: Kyc_Insert_Input;
  passAmount: PassAmount_Insert_Input;
  passPricing: PassPricing_Insert_Input;
  pendingOrder: PendingOrder_Insert_Input;
  eventPassNftContract: EventPassNftContract_Insert_Input;
  eventParameters: EventParameters_Insert_Input;
  stripeCustomer: StripeCustomer_Insert_Input;
  stripeCheckoutSession: StripeCheckoutSession_Insert_Input;
  order: Order_Insert_Input;
  nftTransfer: NftTransfer_Insert_Input;
  eventPassNft: EventPassNft_Insert_Input;
  roleAssignment: RoleAssignment_Insert_Input;
  follow: Follow_Insert_Input;
  packNftContract: PackNftContract_Insert_Input;
};

export type SeedTableName = keyof typeof SeedTable;

export type PgClient = Client;
// assigning the right port depending of if jest is running
// localhost here because has to be working both in local or on nx cloud. work thanks to extra_hosts on db container
export const createDbClient = async (): Promise<Client> => {
  // Create a new client
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: isJestRunning() ? 5454 : 5432,
    connectionTimeoutMillis: 3000, // wait 3 seconds for connection before timing out
  });

  // Connect to the database
  await client.connect();

  return client;
};

export const createDb = async (client: Client) => {
  dbName = 'test-' + Math.random().toString(36).substring(7);
  await client.query(`
    CREATE DATABASE ${dbName}
  `);
};

export const deleteAccounts = async (client: Client) => {
  await client.query('TRUNCATE TABLE account CASCADE;');
};

export const deleteTables = async (client: Client, tables: SeedTableName[]) => {
  const tableNames = tables.map((table) => `"${table}"`).join(', ');
  await client.query(`TRUNCATE TABLE ${tableNames} CASCADE;`);
};

export const deleteAllTables = async (client: Client) => {
  const allTables: SeedTableName[] = Object.keys(SeedTable) as SeedTableName[];
  await deleteTables(client, allTables);
};

export const deleteAccount = async (client: Client, email: string) => {
  // sql delete account from account table cascade delete all tokens and sessions
  await client.query(`
    DELETE FROM account CASCADE
    WHERE email = '${email}'
  `);
};

export const seedDb = async (client: Client, table: SeedTableName) => {
  const order = SeedTable[table];
  const filePath = `./hasura/app/seeds/default/${order}_${table}.sql`;
  const dataSql = fs.readFileSync(filePath).toString();
  await client.query(dataSql);
};

export const applySeeds = async (client: Client, tables: SeedTableName[]) => {
  // Sort the tables based on the predefined order
  const sortedTables = [...tables].sort((a, b) => SeedTable[a] - SeedTable[b]);

  // Seed the tables in the sorted order
  for (const table of sortedTables) {
    await seedDb(client, table);
  }
};

export const queryDb = async (client: Client, sql: string) => {
  await client.query(sql);
};

export const insertObjects = async <T extends SeedTableName>(
  client: Client,
  table: T,
  objects: SeedTypeMap[T][],
): Promise<void> => {
  for (const obj of objects) {
    const columns = Object.keys(obj)
      .map((key) => `"${key}"`)
      .join(', ');
    const values = Object.values(obj)
      .map((value) => {
        if (value instanceof Date) {
          return `'${value.toISOString()}'`;
        }
        return typeof value === 'string' ? `'${value}'` : value;
      })
      .join(', ');

    const sql = `INSERT INTO "${table}" (${columns}) VALUES (${values});`;
    await queryDb(client, sql);
  }
};

export const updateObjects = async <T extends SeedTableName>(
  client: Client,
  table: T,
  updateObject: Partial<SeedTypeMap[T]>,
  whereObject: Partial<SeedTypeMap[T]>,
): Promise<void> => {
  const setClause = Object.entries(updateObject)
    .map(([key, value]) => {
      if (value instanceof Date) {
        return `"${key}" = '${value.toISOString()}'`;
      }
      return `"${key}" = '${value}'`;
    })
    .join(', ');

  const whereClause = Object.entries(whereObject)
    .map(([key, value]) => `"${key}" = '${value}'`)
    .join(' AND ');

  const sql = `UPDATE "${table}" SET ${setClause} WHERE ${whereClause};`;
  await queryDb(client, sql);
};

export const pendingOrders = {
  alpha_user: [
    {
      id: 'd4951f86-1a8f-410a-bbc1-607f1c7933b9',
      accountId: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
      eventPassId: 'clj8raobj7g8l0aw3bfw6dny4',
      quantity: 2,
      created_at: '2023-07-19 12:55:53.506236+00',
    },
    {
      id: 'c44e9122-7818-47c2-8818-508121c9843d',
      accountId: '679f92d6-a01e-4ab7-93f8-10840d22b0a5',
      eventPassId: 'fake-event-pass-2',
      quantity: 2,
      created_at: '2023-07-19 12:58:46.636737+00',
    },
  ] satisfies PendingOrder[],
};
