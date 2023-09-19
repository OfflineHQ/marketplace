/* eslint-disable @typescript-eslint/no-var-requires */
import { isJestRunning } from '@utils';
import { Client } from 'pg';

const fs = require('fs');

let dbName = '';

export const SeedTable = {
  account: 0,
  kyc: 1,
  eventPassPricing: 2,
  eventPassPendingOrder: 3,
  eventPassNftContract: 4,
  eventParameters: 5,
  eventPassNft: 6,
  nftTransfer: 7,
};

export type SeedTableName = keyof typeof SeedTable;

export type PgClient = Client;
// assigning the right port depending of if jest or cypress is running
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
