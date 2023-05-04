'use client';
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
import { useAuthContext } from '@client/auth';

// Page
// ========================================================
export default function Home() {
  const { safeUser } = useAuthContext();
  return (
    <div className="p-8">
      <Text>
        {safeUser ? `Welcome ${safeUser.name}` : 'You are not logged in'}
      </Text>
      <ConnectWallet user={safeUser} />
    </div>
  );
}
