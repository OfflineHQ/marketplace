// import { Button, Text } from '@ui/components';

// export default async function Page() {
//   return (
//     <>
//       <Button>Server Button</Button>
//     </>
//   );
// }

// Imports
// ========================================================
import React from 'react';
import ConnectWallet from './wallet';
import { getCurrentUser } from '@web/lib/session';
import { Text } from '@ui/components';

// Page
// ========================================================
export default async function Home() {
  const user = await getCurrentUser();
  // Render
  return (
    <div className="p-8">
      <Text>{user ? `Welcome ${user.id}` : 'You are not logged in'}</Text>
      <ConnectWallet user={user} />
    </div>
  );
}
