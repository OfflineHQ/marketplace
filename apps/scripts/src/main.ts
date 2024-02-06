import { adminSdk } from '@gql/admin/api';
import {
  KycLevelName_Enum,
  KycStatus_Enum,
  Roles_Enum,
} from '@gql/shared/types';
import { insertObjects } from '@test-utils/db';
import { Client } from 'pg';

// by default, give the role of super admin to the test organizer in Hygraph
export const giveRoleForTest = async (
  address: string,
  role = Roles_Enum.OrganizerSuperAdmin,
  organizerId = 'clizzky8kap2t0bw7wka9a2id',
) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432, // Use the DB_PORT environment variable, or 5432 if DB_PORT is not set
    connectionTimeoutMillis: 3000, // wait 3 seconds for connection before timing out
  });

  // Connect to the database
  await client.connect();
  const data = await adminSdk.GetAccount({ address });
  const account = data?.account[0];
  if (!account) {
    throw new Error(`Account with address ${address} not found`);
  }
  console.log(`Fetched account with address: ${address}`, account);
  if (!account.kyc) {
    await insertObjects(client, 'kyc', [
      {
        applicantId: `fake-${Math.floor(Math.random() * 10000)}`,
        externalUserId: account.id,
        reviewStatus: KycStatus_Enum.Completed,
        levelName: KycLevelName_Enum.AdvancedKycLevel,
      },
    ]);
  }
  await insertObjects(client, 'roleAssignment', [
    {
      accountId: account.id,
      invitedById: account.id,
      role,
      organizerId,
    },
  ]);
};

// Assuming the first argument is the address, the second is the role, and the third is the organizerId
console.log(process.argv);
const address = process.argv[2];
const role = process.argv[3] as Roles_Enum;
const organizerId = process.argv[4];

// Call the function with the provided arguments
giveRoleForTest(address, role, organizerId)
  .then(() => console.log('Role assigned successfully'))
  .catch((error) => console.error('Failed to assign role:', error));
