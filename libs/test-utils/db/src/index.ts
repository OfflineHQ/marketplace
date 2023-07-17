/* eslint-disable @typescript-eslint/no-var-requires */
import { isJestRunning } from '@utils';
import { Client } from 'pg';

const fs = require('fs');

let dbName = '';

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

export const clearDb = async (client: Client) => {
  await client.query('TRUNCATE TABLE account CASCADE;');
};

export const deleteAccounts = async (client: Client) => {
  await client.query('TRUNCATE TABLE account CASCADE;');
};

export const deleteTables = async (client: Client, table: string) => {
  await client.query(`TRUNCATE TABLE ${table} CASCADE;`);
};

export const deleteAccount = async (client: Client, email: string) => {
  // sql delete account from account table cascade delete all tokens and sessions
  await client.query(`
    DELETE FROM account CASCADE
    WHERE email = '${email}'
  `);
};

export const seedDb = async (client: Client, filePath: string) => {
  const dataSql = fs.readFileSync(filePath).toString();
  await client.query(dataSql);
};

export const queryDb = async (client: Client, sql: string) => {
  await client.query(sql);
};

// export const deleteSeedDb = async (filePath: string) => {
//   const client = await dbClient();
//   const dataSql = fs.readFileSync(filePath).toString();

// }
