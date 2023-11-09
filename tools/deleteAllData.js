const { Client } = require('pg');

const deleteAllData = async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: process.env.DB_PORT || 5432, // Use the DB_PORT environment variable, or 5432 if DB_PORT is not set
    connectionTimeoutMillis: 3000, // wait 3 seconds for connection before timing out
  });

  // Connect to the database
  await client.connect();

  const tablesToDelete =
    '"roleAssignments", "nftTransfer", "eventPassNft", "eventPassOrder", "stripeCheckoutSession", "stripeCustomer", "eventParameters", "eventPassNftContract", "eventPassPendingOrder", "eventPassPricing", "kyc", "account"';
  await client.query(`TRUNCATE TABLE ${tablesToDelete} CASCADE;`);
  // Close the connection
  await client.end();
};
deleteAllData()
  .then(() => {
    console.log(
      'Data deletion completed with port:',
      process.env.DB_PORT || '5432',
    );
    process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
