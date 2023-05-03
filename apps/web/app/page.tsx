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
import { useAuthContext } from '@web/lib/providers';

// Page
// ========================================================
export default function Home() {
  const { userInfo } = useAuthContext();
  return (
    <div className="p-8">
      <Text>{userInfo ? `Welcome ${userInfo.name}` : 'You are not logged in'}</Text>
      <ConnectWallet user={userInfo} />
    </div>
  );
}
